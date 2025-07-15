import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Board } from '../../boards/schemas/board.schema';
import { Task } from 'src/tasks/schemas/task.schema';

@Schema({ timestamps: true })
export class Column extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Board', required: true })
  board: Board;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Task' }])
  tasks: Task[];
}

export const ColumnSchema = SchemaFactory.createForClass(Column);   