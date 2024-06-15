import { Date } from "mongoose";

export class Blog {
    blogId: number;
    description:string;
    noOfCharacters:number;
    datetime:Date;
    likes:number;
    likedBy:string[];
}
