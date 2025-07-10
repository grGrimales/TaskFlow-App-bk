// src/tasks/schemas/task.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Column } from '../../columns/schemas/column.schema';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Column', required: true })
  column: Column;

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  assignedUsers: User[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);