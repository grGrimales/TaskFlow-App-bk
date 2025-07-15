import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Column } from '../../columns/schemas/column.schema'; 

@Schema({ timestamps: true })
export class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Column' }])
  columns: Column[];

    @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  members: User[];

}

export const BoardSchema = SchemaFactory.createForClass(Board);