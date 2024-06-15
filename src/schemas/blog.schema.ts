import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as  mongoose from 'mongoose';
import {User} from './user.schema'

@Schema()
export class Blog{
  @Prop({unique:true})
  blogId:number;

  @Prop()
  description: string;

  @Prop()
  noOfCharacters: number;

  @Prop({default:0})
  likes: number;

  @Prop({default:0})
  comments: number;
  
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] }) 
  likedBy: String[];

  @Prop({ default: Date.now })
  datetime: Date;
 
  @Prop({ type:mongoose.Schema.Types.ObjectId,ref:'User' }) 
  userId:User

  @Prop({default:' '})
  blogPicture: string;
}
export const blogSchema = SchemaFactory.createForClass(Blog);
