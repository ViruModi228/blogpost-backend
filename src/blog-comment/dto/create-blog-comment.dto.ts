export class CreateBlogCommentDto {
    blogId:string;
    content:string;
    noOfCharacters: number;
    commentLikes:number;
    createdAt: Date;
    userId:string;
    parentCommentId:string;
    replies:number
}
