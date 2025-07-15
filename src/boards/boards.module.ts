import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from './schemas/board.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema,  }]),  UsersModule, 
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}