import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogComment } from './entities/blog-comment.entity';
import { Blog } from '../blog/entities/blog.entity';

@Injectable()
export class BlogCommentService {
  constructor(@InjectModel(BlogComment.name) private readonly blogCommentModel: Model<BlogComment>,
  @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,) { }

  async create(createBlogCommentDto: CreateBlogCommentDto): Promise<BlogComment> {
    try {
      console.log('in create blog comment service method!')
      console.log('blog id in create blog comment service ', createBlogCommentDto.blogId)
      console.log('user id in create blog comment service ', createBlogCommentDto.userId)

      createBlogCommentDto.noOfCharacters = createBlogCommentDto.content.length;
      const newBlogComment = await this.blogCommentModel.create(createBlogCommentDto);

       await this.blogModel.findByIdAndUpdate(
        createBlogCommentDto.blogId,
        { $inc: { comments: 1 } },
      );

      if (createBlogCommentDto.parentCommentId) {
        await this.blogCommentModel.findByIdAndUpdate(
          createBlogCommentDto.parentCommentId,
          { $inc: { replies: 1 } },
        );
      }

      return newBlogComment;
    } catch (err) {
      console.log("error in service", err);
      throw new InternalServerErrorException('failed to create blog')
    }
  }

  async getCommentsForBlog(blogId : string): Promise<any> {
    try {
      console.log('in get comments for a particular blog service method!')
      console.log('blog id in get comments for blog service method', blogId)
      const comments = await this.blogCommentModel.find({blogId,parentCommentId:null}).populate('userId').exec();
      console.log(comments)
      
      if (comments) {
        return comments;
      }
    } catch (error) {
      console.log('error occured in getting comments method!')
    }
  }

  async getCommentsForComment(parentCommentId:string): Promise<any> {
    try {
      console.log('in get comments for a particular blog service method!')
      console.log('comment id in get comments for blog service method', parentCommentId)
      
      const comments = await this.blogCommentModel.find({ parentCommentId }).populate('userId').exec();
      console.log(comments)

      if (comments) {
        return comments;
      }
    } catch (error) {
      console.log('error occured in getting comments method!')
    }
  }

  async likeBlogComment(blogCommentId: string, userId: string): Promise<any> {
    console.log("in liking/disliking a blog comment service method comment id -> ", blogCommentId)
    console.log("in liking/disliking a blog comment service method user id -> ", userId)
    const blogComment = await this.blogCommentModel.findById(blogCommentId)
    console.log(blogComment)
    if (!blogComment) {
      throw new NotFoundException('Blog Comment not found');
    }
    const userIndex = blogComment.likedBy.indexOf(userId as any);
    if (userIndex !== -1) {
      blogComment.commentLikes -= 1;
      blogComment.likedBy.splice(userIndex, 1);
    } else {
      blogComment.commentLikes += 1;
      blogComment.likedBy.push(userId as any);
    }
    await blogComment.save();
    return blogComment;
  }
}
