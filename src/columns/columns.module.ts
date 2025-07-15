import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController, ColumnActionsController } from './columns.controller'; 
import { MongooseModule } from '@nestjs/mongoose';
import { Column, ColumnSchema } from './schemas/column.schema';
import { Board, BoardSchema } from '../boards/schemas/board.schema';
import { Label, LabelSchema } from '../labels/schemas/label.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Column.name, schema: ColumnSchema },
      { name: Board.name, schema: BoardSchema },
       { name: Label.name, schema: LabelSchema },
    ])
  ],
  controllers: [ColumnsController, ColumnActionsController], 
  providers: [ColumnsService],
})
export class ColumnsModule {}