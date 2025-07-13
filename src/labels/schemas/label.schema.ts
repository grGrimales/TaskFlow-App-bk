// src-backend/labels/schemas/label.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Board } from '../../boards/schemas/board.schema';

export type LabelDocument = Label & Document;

@Schema({ timestamps: true })
export class Label {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;

 @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Board', required: false })
  board?: Board;
}

export const LabelSchema = SchemaFactory.createForClass(Label);