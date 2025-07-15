
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Task } from '../../tasks/schemas/task.schema';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Task', required: true })
  task: Task;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);