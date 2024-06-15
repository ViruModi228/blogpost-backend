import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as  mongoose from 'mongoose';
import { Blog } from './blog.schema'
import { User } from './user.schema';

@Schema()
export class BlogComment{
    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'Blog',required:true})
    blogId:Blog;

    @Prop({type: mongoose.Schema.Types.ObjectId,ref:'User',required:true})
    userId:User;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'BlogComment',default:null})
    parentCommentId:BlogComment | null;

    @Prop({required:true})
    content:string

    @Prop({default:0})
    commentLikes:number

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] }) 
    likedBy: String[];

    @Prop({default:Date.now})
    createdAt:Date

    @Prop({default:0})
    replies:number
}

export const  BlogCommentSchema=SchemaFactory.createForClass(BlogComment);
