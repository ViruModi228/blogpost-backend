import { Date } from "mongoose";

export class BlogComment {
    blogId:number;
    content:string;
    commentLikes:number;
    createdAt: Date;
    likedBy:String[];
    userId:string;
    parentCommentId:string;
    replies:number;
}
