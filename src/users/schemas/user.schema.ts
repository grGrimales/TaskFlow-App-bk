import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {

    declare _id: Types.ObjectId;

   
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false }) 
  currentHashedRefreshToken?: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);