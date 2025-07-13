// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async search(query: string, currentUserId: string): Promise<User[]> {
    const regex = new RegExp(query, 'i'); // Búsqueda "case-insensitive"

    return this.userModel.find({
      _id: { $ne: currentUserId }, // Excluir al usuario actual de los resultados
      $or: [{ name: regex }, { email: regex }],
    })
      .limit(10) // Limitar a 10 resultados para no sobrecargar
      .select('name email') // Devolver solo los campos necesarios
      .exec();
  }


  async setCurrentRefreshToken(userId: string, refreshToken: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      currentHashedRefreshToken: refreshToken,
    });
  }


  async findOneById(id: string): Promise<User | null> { // <-- CORRECCIÓN AQUÍ
    return this.userModel.findById(id).exec();
  }


}