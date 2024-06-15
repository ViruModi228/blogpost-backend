/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  first_name: string;

  @Prop()
  last_name : string;

  @Prop({unique:[true, 'Email already exists']})
  email : string;

  @Prop()
  password : string;

  @Prop({ default: '' })
  profilePicture: string;  
  
  @Prop({default:' '})
  token:string;
}
export const userSchema = SchemaFactory.createForClass(User);