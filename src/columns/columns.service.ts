// src/columns/columns.service.ts
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Column } from './schemas/column.schema';
import { Board } from '../boards/schemas/board.schema';
import { CreateColumnDto } from './dto/create-column.dto';
import { Label } from '../labels/schemas/label.schema'; // <-- AÑADIR ESTA LÍNEA


@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Column.name) private columnModel: Model<Column>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Label.name) private labelModel: Model<Label>
  ) { }

  // Método auxiliar para verificar la propiedad del tablero
  private async checkBoardOwnership(boardId: string, userId: string): Promise<Board> {
    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new NotFoundException(`Tablero con ID "${boardId}" no encontrado.`);
    }

    // CORRECCIÓN: Permitir acceso si el usuario es el dueño O un miembro.
    const isOwner = board.owner.toString() === userId;
    const isMember = board.members.some(memberId => memberId.toString() === userId);

    if (!isOwner && !isMember) {
      throw new UnauthorizedException('No tienes permiso para acceder a este tablero.');
    }
    return board;
  }

  async create(boardId: string, createColumnDto: CreateColumnDto, userId: string): Promise<Column> {
    const board = await this.checkBoardOwnership(boardId, userId);

    const newColumn = new this.columnModel({
      ...createColumnDto,
      board: boardId,
    });

    await newColumn.save();

    board.columns.push(newColumn);
    await board.save();

    return newColumn;
  }


async findAllForBoard(boardId: string, userId: string): Promise<Column[]> {
    await this.checkBoardOwnership(boardId, userId);

    const boardWithData = await this.boardModel.findById(boardId).populate({
      path: 'columns',
      populate: {
        path: 'tasks',
        model: 'Task',
        populate: [
          {
            path: 'assignedUsers',
            model: 'User',
            select: 'name email _id',
          },
          {
            path: 'labels',
            model: 'Label', // Asegúrate de que el modelo se llame 'Label'
          },
        ],
      },
    }).exec();

    if (!boardWithData) {
      throw new NotFoundException(`Tablero con ID "${boardId}" no encontrado.`);
    }

    // Filtro de seguridad en el backend
    boardWithData.columns.forEach(column => {
        column.tasks.forEach(task => {
            if (task.labels) {
                // @ts-ignore
                task.labels = task.labels.filter(label => label != null);
            }
        });
    });

    return boardWithData.columns;
  }


  async update(columnId: string, updateColumnDto: CreateColumnDto, userId: string): Promise<Column> {
    const column = await this.columnModel.findById(columnId).populate<{ board: Board }>('board');
    if (!column) {
      throw new NotFoundException(`Columna con ID "${columnId}" no encontrada.`);
    }

    if (!column.board) {
      throw new NotFoundException(`El tablero asociado a la columna con ID "${columnId}" no fue encontrado.`);
    }

    if (column.board.owner.toString() !== userId) {
      throw new UnauthorizedException('No tienes permiso para modificar esta columna.');
    }

    const updatedColumn = await this.columnModel.findByIdAndUpdate(columnId, updateColumnDto, { new: true }).exec();

    // AÑADIMOS ESTA VALIDACIÓN para satisfacer a TypeScript
    if (!updatedColumn) {
      throw new NotFoundException(`Columna con ID "${columnId}" no encontrada durante la actualización.`);
    }

    return updatedColumn;
  }

  async remove(columnId: string, userId: string): Promise<{ message: string }> {
    const column = await this.columnModel.findById(columnId);
    if (!column) {
      throw new NotFoundException(`Columna con ID "${columnId}" no encontrada.`);
    }

    const board = await this.checkBoardOwnership(column.board.toString(), userId);

    // Eliminar la columna de la base de datos
    await this.columnModel.findByIdAndDelete(columnId);

    // Eliminar la referencia a la columna en el array del tablero
    await this.boardModel.findByIdAndUpdate(board._id, {
      $pull: { columns: columnId },
    });

    return { message: `Columna con ID "${columnId}" eliminada exitosamente.` };
  }
}
