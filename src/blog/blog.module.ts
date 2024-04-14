/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, blogSchema } from '../schemas/blog.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Blog.name, schema:blogSchema}])
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
