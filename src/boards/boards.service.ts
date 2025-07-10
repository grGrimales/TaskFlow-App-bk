// src/boards/boards.service.ts
import { Injectable, NotFoundException, UnauthorizedException, BadRequestException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { UpdateColumnOrderDto } from './dto/update-column-order.dto';
import { UsersService } from 'src/users/users.service';
import { User } from '../users/schemas/user.schema'; // 1. Importa el modelo de User


@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(User.name) private userModel: Model<User>,
    private usersService: UsersService
  ) { }

async create(createBoardDto: CreateBoardDto, user: any): Promise<Board> {
 
    console.log(user)
 
  const newBoard = new this.boardModel({
    ...createBoardDto,
    owner: user._id, // El creador sigue siendo el dueño
    members: [user._id] // <<-- CAMBIO AQUÍ: Añade al creador como el primer miembro
  });
  return newBoard.save();
}

  async findAllForUser(ownerId: string): Promise<Board[]> {
    return this.boardModel.find({ owner: ownerId }).exec();
  }

  async findOne(id: string, ownerId: string): Promise<Board> {
    const board = await this.boardModel.findById(id).exec();
    if (!board) {
      throw new NotFoundException(`Tablero con ID "${id}" no encontrado.`);
    }
    if (board.owner.toString() !== ownerId) {
      throw new UnauthorizedException('No tienes permiso para acceder a este tablero.');
    }
    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto, ownerId: string): Promise<Board> {
    await this.findOne(id, ownerId);

    const updatedBoard = await this.boardModel.findByIdAndUpdate(id, updateBoardDto, { new: true }).exec();

    if (!updatedBoard) {

      throw new NotFoundException(`Tablero con ID "${id}" no encontrado durante la actualización.`);
    }

    return updatedBoard;
  }

  async remove(id: string, ownerId: string): Promise<{ message: string }> {
    await this.findOne(id, ownerId);
    await this.boardModel.findByIdAndDelete(id).exec();
    return { message: `Tablero con ID "${id}" eliminado exitosamente.` };
  }



  async updateColumnOrder(id: string, updateColumnOrderDto: UpdateColumnOrderDto, ownerId: string): Promise<Board> {
    await this.findOne(id, ownerId);

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

  async addMember(boardId: string, email: string): Promise<Board> {
    // 3. Busca si el usuario existe por su email
    const userToAdd = await this.userModel.findOne({ email });

    if (!userToAdd) {
      // Si no se encuentra, lanza un error claro
      throw new NotFoundException(`El usuario con el correo '${email}' no fue encontrado.`);
    }

    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new NotFoundException(`El tablero con ID ${boardId} no fue encontrado.`);
    }

    // 4. Verifica que el miembro no esté ya en el tablero
    if (board.members.includes(userToAdd.id)) {
        throw new BadRequestException(`El usuario '${email}' ya es miembro de este tablero.`);
    }

    // 5. Si todo está bien, añade el ID del usuario y guarda
    board.members.push(userToAdd.id);
    await board.save();

    return board.populate('members');
  }

}