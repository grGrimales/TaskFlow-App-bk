import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { Column } from '../columns/schemas/column.schema';
import { Board } from '../boards/schemas/board.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MoveTaskDto } from './dto/move-task.dto';
import { AssignUsersDto } from './dto/assign-users.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Column.name) private columnModel: Model<Column>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
  ) { }

  async create(columnId: string, createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const column = await this.columnModel.findById(columnId);
    if (!column) {
      throw new NotFoundException(`Columna con ID "${columnId}" no encontrada.`);
    }

    const board = await this.boardModel.findById(column.board);
    if (!board || board.owner.toString() !== userId) {
      throw new UnauthorizedException('No tienes permiso para añadir tareas a esta columna.');
    }

    const newTask = new this.taskModel({
      ...createTaskDto,
      column: columnId,
    });

    await newTask.save();

    column.tasks.push(newTask);
    await column.save();

    return newTask;
  }

  async update(taskId: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.taskModel.findById(taskId).populate({
      path: 'column',
      select: 'board', 
      populate: {
        path: 'board',
        model: 'Board',
        select: 'owner members' 
      },
      
      

    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID "${taskId}" no encontrada.`);
    }

    const board = (task.column as any)?.board;
    if (!board) {
      throw new NotFoundException('El tablero asociado a esta tarea no fue encontrado.');
    }
    const isOwner = board.owner.toString() === userId;
    const isMember = board.members.some(memberId => memberId.toString() === userId);

    if (!isOwner && !isMember) {
      throw new UnauthorizedException('No tienes permiso para modificar esta tarea.');
    }

    const updatedTask = await this.taskModel.findByIdAndUpdate(taskId, updateTaskDto, { new: true }).exec();
    

    if (!updatedTask) {
      throw new NotFoundException(`Tarea con ID "${taskId}" no encontrada durante la actualización.`);
    }
    return updatedTask;
  }


  async remove(taskId: string, userId: string): Promise<{ message: string }> {
    const task = await this.taskModel.findById(taskId).populate({
      path: 'column',
      populate: { path: 'board', model: 'Board' }
    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID "${taskId}" no encontrada.`);
    }

    const boardOwnerId = (task.column as any)?.board?.owner?.toString();
    if (!boardOwnerId || boardOwnerId !== userId) {
      throw new UnauthorizedException('No tienes permiso para eliminar esta tarea.');
    }

    const columnId = task.column._id;
    await this.taskModel.findByIdAndDelete(taskId);
    await this.columnModel.findByIdAndUpdate(columnId, { $pull: { tasks: taskId } });

    return { message: `Tarea con ID "${taskId}" eliminada exitosamente.` };
  }

  async move(taskId: string, moveTaskDto: MoveTaskDto, userId: string): Promise<void> {

    const { sourceColumnId, sourceTaskIds, destinationColumnId, destinationTaskIds } = moveTaskDto;

  
    const sourceColumn = await this.columnModel.findById(sourceColumnId).populate('board');
    if (!sourceColumn) {
      throw new NotFoundException(`Columna de origen con ID "${sourceColumnId}" no encontrada.`);
    }
    const board = sourceColumn.board as unknown as Board;
    if (board.owner.toString() !== userId) {
      throw new UnauthorizedException('No tienes permiso para mover tareas en este tablero.');
    }

    // Caso 1: La tarea se mueve dentro de la misma columna.
    if (sourceColumnId === destinationColumnId) {
      await this.columnModel.findByIdAndUpdate(sourceColumnId, {
        tasks: destinationTaskIds,
      });
    } else {
      // Caso 2: La tarea se mueve a una columna diferente.
      await Promise.all([
        // 1. Actualizar la columna de origen.
        this.columnModel.findByIdAndUpdate(sourceColumnId, {
          tasks: sourceTaskIds,
        }),
        // 2. Actualizar la columna de destino.
        this.columnModel.findByIdAndUpdate(destinationColumnId, {
          tasks: destinationTaskIds,
        }),
        // 3. Actualizar la referencia de la columna en la propia tarea.
        this.taskModel.findByIdAndUpdate(taskId, { column: destinationColumnId }),
      ]);
    }
  }


  async assignUsers(taskId: string, assignUsersDto: AssignUsersDto, userId: string): Promise<Task> {
    const task = await this.taskModel.findById(taskId).populate({
      path: 'column',
      populate: {
        path: 'board',
        model: 'Board'
      }
    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID "${taskId}" no encontrada.`);
    }

    const board = (task.column as any)?.board;
    if (!board || board.owner.toString() !== userId) {
      throw new UnauthorizedException('No tienes permiso para modificar esta tarea.');
    }

    const { userIds } = assignUsersDto;

    // Validar que todos los usuarios a asignar son miembros del tablero
    const boardMemberIds = board.members.map(id => id.toString());
    const allUsersAreMembers = userIds.every(id => boardMemberIds.includes(id));

    if (!allUsersAreMembers) {
      throw new UnauthorizedException('Solo puedes asignar tareas a miembros del tablero.');
    }

    task.assignedUsers = userIds as any; 
    return task.save();
  }


    async addChecklistItem(taskId: string, createDto: CreateChecklistItemDto): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(
      taskId,
      { $push: { checklist: createDto } }, // $push añade el nuevo item al array
      { new: true }, // Devuelve el documento actualizado
    ).populate('labels checklist'); // Populamos para devolver todo completo
    
    if (!task) {
      throw new NotFoundException(`Tarea con ID "${taskId}" no encontrada.`);
    }
    return task;
  }


    async updateChecklistItem(taskId: string, itemId: string, updateDto: UpdateChecklistItemDto): Promise<Task> {
    const task = await this.taskModel.findOneAndUpdate(
      { _id: taskId, 'checklist._id': itemId }, 
      { $set: { 'checklist.$.completed': updateDto.completed } }, 
      { new: true },
    ).populate('labels checklist');

    if (!task) {
      throw new NotFoundException(`Sub-tarea con ID "${itemId}" no encontrada en la tarea "${taskId}".`);
    }
    return task;
  }

    async removeChecklistItem(taskId: string, itemId: string): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(
      taskId,
      { $pull: { checklist: { _id: itemId } } }, 
      { new: true },
    ).populate('labels checklist');
    
    if (!task) {
      throw new NotFoundException(`Tarea con ID "${taskId}" no encontrada.`);
    }
    return task;
  }

}
