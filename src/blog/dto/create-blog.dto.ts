export class CreateBlogDto {
    blogId: number;
    description:string;
    noOfCharacters:number;
    datetime:Date;
    userId: string; 
    blogPicture:string; 
}
