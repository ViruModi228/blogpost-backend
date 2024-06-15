/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './entities/blog.entity';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) { }

  async findLastBlogId(): Promise<number> {
    const lastBlog = await this.blogModel.findOne().sort({ blogId: -1 }).exec();
    return lastBlog ? lastBlog.blogId + 1 : 1; // if no blog then return 1 as it will be the first blog
  }

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    try {
      console.log('in create blog service')

      createBlogDto.blogId = await this.findLastBlogId();
      createBlogDto.noOfCharacters = createBlogDto.description.length

      console.log('new blog id = ' + createBlogDto.blogId)
      console.log('user id in service = ', createBlogDto.userId)
      const newBlog = await this.blogModel.create(createBlogDto);
      console.log("saved blog", newBlog);
      return newBlog;
    } catch (err) {
      console.log("error in service", err);
      throw new InternalServerErrorException('failed to create blog');
    }
  }

  async likeBlog(blogId: number, userId: string): Promise<Blog> {
    console.log("in liking/disliking a blog service method blog id -> ", blogId)
    const blog = await this.blogModel.findOne({ blogId })
    if (!blog) {
      throw new NotFoundException('Blog not found');
    }
    const userIndex = blog.likedBy.indexOf(userId as any);
    if (userIndex !== -1) {
      blog.likes -= 1;
      blog.likedBy.splice(userIndex, 1);
    } else {
      blog.likes += 1;
      blog.likedBy.push(userId as any);
    }
    await blog.save();
    return blog;
  }

  async getBlogLikes(blogId: number, userId: string): Promise<String[]> {
    console.log("in get blog likes service method blogId ", blogId);
    const blog = await this.blogModel.findOne({ blogId }).populate('likedBy')
    console.log("likes of blog ", blog)
    if (blog) {
      return blog.likedBy;
    }
    else {
      throw new NotFoundException('blog not found')
    }
  }

  async findAll(): Promise<any> {
    const allBlogs = await this.blogModel.find().populate('userId').exec();
    console.log(allBlogs);
    return allBlogs
  }

  async findAllForUser(userId : string): Promise<any> {
    const allBlogs = await this.blogModel.find({userId:userId}).populate('userId').exec();
    console.log(allBlogs);
    return allBlogs
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<any> {
    try {
      if (updateBlogDto.description && updateBlogDto.description.length > 0) {
        updateBlogDto.noOfCharacters = updateBlogDto.description.length;
      }
      const updatedBlog = await this.blogModel.findByIdAndUpdate(id, updateBlogDto, { new: true });
      return updatedBlog;
    } catch (error) {
      console.error('Error updating blog in service:', error);
      throw new InternalServerErrorException('Failed to update blog');
    }
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      console.log('in blog delete service method!');
      console.log('blog id in service -> ', id);

      const deleteBlog = await this.blogModel.findByIdAndDelete(id);
      if (!deleteBlog) {
        throw new NotFoundException('Blog not found!');
      }
      console.log('blog successfully deleted in service');
      return { message: 'Blog successfully deleted' };
    } catch (error) {
      console.log('error in delete method of service (server error)', error);
      throw new InternalServerErrorException('Failed to delete blog');
    }
  }
}
