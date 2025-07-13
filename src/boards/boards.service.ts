// src/boards/boards.service.ts
import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Board } from './schemas/board.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { UpdateColumnOrderDto } from './dto/update-column-order.dto';
import { UsersService } from 'src/users/users.service';
import { User } from '../users/schemas/user.schema'; // 1. Importa el modelo de User
import { Model, Types } from 'mongoose'; 

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService
  ) { }

  async create(createBoardDto: CreateBoardDto, user: any): Promise<Board> {

    const newBoard = new this.boardModel({
      ...createBoardDto,
      owner: user._id, // El creador sigue siendo el dueño
      members: [user._id] 
    });
    return newBoard.save();
  }

  async findAllForUser(ownerId: string): Promise<Board[]> {
    return this.boardModel.find({ owner: ownerId }).exec();
  }

async findOne(id: string, userId: string): Promise<Board> { // Parámetro renombrado
  const board = await this.boardModel.findById(id)
    .populate({
      path: 'columns',
      populate: {
        path: 'tasks',
        model: 'Task',
        populate: {
          path: 'assignedUsers',
          model: 'User',
          select: 'name email _id',
        },
      },
    })
    .populate('members', 'name email _id')
    .exec();
  if (!board) {
    throw new NotFoundException(`Tablero con ID "${id}" no encontrado.`);
  }

  // CORRECCIÓN: Permitir acceso si el usuario es el dueño O un miembro.
  const isOwner = board.owner.toString() === userId;
  const isMember = board.members.some(member => (member as any)._id.toString() === userId);

  if (!isOwner && !isMember) {
    throw new UnauthorizedException('No tienes permiso para acceder a este tablero.');
  }
  return board;
}

  async update(id: string, updateBoardDto: UpdateBoardDto, userId: string): Promise<Board> {
  await this.findOne(id, userId);

    const updatedBoard = await this.boardModel.findByIdAndUpdate(id, updateBoardDto, { new: true }).exec();

    if (!updatedBoard) {

      throw new NotFoundException(`Tablero con ID "${id}" no encontrado durante la actualización.`);
    }

    return updatedBoard;
  }

async remove(id: string, userId: string): Promise<{ message: string }> {
  await this.findOne(id, userId);
    await this.boardModel.findByIdAndDelete(id).exec();
    return { message: `Tablero con ID "${id}" eliminado exitosamente.` };
  }



async updateColumnOrder(id: string, updateColumnOrderDto: UpdateColumnOrderDto, userId: string): Promise<Board> {
  await this.findOne(id, userId);

    const { columnIds } = updateColumnOrderDto;

    const updatedBoard = await this.boardModel.findByIdAndUpdate(
      id,
      { columns: columnIds },
      { new: true }
    ).exec();

    if (!updatedBoard) {
      throw new NotFoundException(`Tablero con ID "${id}" no encontrado durante la actualización.`);
    }

    return updatedBoard;
  }


 async addMembers(boardId: string, emails: string[], userId: string): Promise<Board> {
    const board = await this.boardModel.findById(boardId);
    if (!board) {
        throw new NotFoundException(`Tablero con ID ${boardId} no fue encontrado.`);
    }
    if (board.owner.toString() !== userId && !board.members.map(m => m.toString()).includes(userId)) {
        throw new UnauthorizedException('No tienes permiso para invitar miembros a este tablero.');
    }

    const usersToAdd = await this.userModel.find({ email: { $in: emails } });
    
    if (usersToAdd.length !== emails.length) {
        throw new NotFoundException('Uno o más correos no fueron encontrados.');
    }

    const memberIds = board.members.map(id => id.toString());
    
    // <<-- 2. AÑADE EL TIPO EXPLÍCITO AL ARRAY
    const newMemberIds: Types.ObjectId[] = [];

    for (const user of usersToAdd) {
        if (!memberIds.includes(user._id.toString())) {
            // Ahora esto funcionará sin errores.
            newMemberIds.push(user._id);
        }
    }

    if (newMemberIds.length === 0) {
        throw new BadRequestException('Todos los usuarios seleccionados ya son miembros de este tablero.');
    }

    board.members.push(...newMemberIds as any); // Usamos 'as any' aquí porque Mongoose puede ser estricto
    await board.save();
    
    return board.populate<{ members: User[] }>('members');
  }

}