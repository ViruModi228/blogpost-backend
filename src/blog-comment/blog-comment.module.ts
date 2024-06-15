import { Module } from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { BlogCommentController } from './blog-comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogCommentSchema, BlogComment } from 'src/schemas/blog-comment.schema';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports:[
    BlogModule,
    MongooseModule.forFeature([{name:BlogComment.name, schema:BlogCommentSchema}])
  ],
  controllers: [BlogCommentController],
  providers: [BlogCommentService],
})
export class BlogCommentModule {}
