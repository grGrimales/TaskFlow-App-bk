// src/columns/columns.module.ts
import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
// Importar ambos controladores
import { ColumnsController, ColumnActionsController } from './columns.controller'; 
import { MongooseModule } from '@nestjs/mongoose';
import { Column, ColumnSchema } from './schemas/column.schema';
import { Board, BoardSchema } from '../boards/schemas/board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Column.name, schema: ColumnSchema },
      { name: Board.name, schema: BoardSchema }
    ])
  ],
  // Añadir ambos controladores aquí
  controllers: [ColumnsController, ColumnActionsController], 
  providers: [ColumnsService],
})
export class ColumnsModule {}