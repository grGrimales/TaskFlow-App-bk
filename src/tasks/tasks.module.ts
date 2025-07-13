// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
// Importar ambos controladores
import { TasksController, TaskActionsController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { Column, ColumnSchema } from '../columns/schemas/column.schema';
import { Board, BoardSchema } from '../boards/schemas/board.schema';
import { LabelsModule } from 'src/labels/labels.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Column.name, schema: ColumnSchema },
      { name: Board.name, schema: BoardSchema },
    ]),
    LabelsModule
  ],
  // Registrar ambos controladores
  controllers: [TasksController, TaskActionsController],
  providers: [TasksService],
})
export class TasksModule {}