// src/tasks/schemas/task.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Column } from '../../columns/schemas/column.schema';
import { User } from 'src/users/schemas/user.schema';
import { Label } from '../../labels/schemas/label.schema';


export enum Priority {
  BAJA = 'Baja',
  MEDIA = 'Media',
  ALTA = 'Alta',
}


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

  @Prop({ type: Date, required: false })
  dueDate: Date; // Fecha de vencimiento

  @Prop({
    type: String,
    enum: Object.values(Priority), // Usar el enum que definimos
    default: Priority.MEDIA
  })
  priority: Priority; // Prioridad de la tarea
  
@Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Label' }],
    default: [],
  })
  labels: Label[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);