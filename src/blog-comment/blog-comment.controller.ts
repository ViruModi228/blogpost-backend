import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from 'src/users/fetchUserId';

@Controller('blog-comment')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) { }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async create(@Param('id') id: string, @UserId() userId: string, @Body() createBlogCommentDto: CreateBlogCommentDto, @Res() res) {
    try {
      console.log('user id in create comment controller ', userId)
      console.log('blog id in create comment controller ', id)
      console.log('content in create comment controller',createBlogCommentDto.content)
      createBlogCommentDto.userId = userId;
      createBlogCommentDto.blogId = id;


      const newBlogComment = await this.blogCommentService.create(createBlogCommentDto);
      return res.status(201).json({
        message: "BlogComment added successfully",
        data: newBlogComment
      })
    }
    catch (error) {
      return res.status(400).json({
        message: error.message
      })
    }
  }

  @Get(':id/comments')
  @UseGuards(AuthGuard('jwt'))
  async getCommentsofBlog(@UserId() userId: string, @Res() res, @Param('id') id:string) {
    try {
      console.log('blog id in get comments controller ', id)
      console.log('in get comments for a particular blog controller method!')
      const comments = await this.blogCommentService.getCommentsForBlog(id);
      if (comments) {
        return res.status(200).json({
          message: "Comments for blog fetched successfully",
          data: comments
        })
      }
      else {
        return res.status(404)({
          message: "error fetching comments for the blog!!!"
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: "server boom hogya!"
      })
    }
  }

  @Get(':id/comments/parent')
  @UseGuards(AuthGuard('jwt'))
  async getCommentsofComment(@UserId() userId: string, @Res() res, @Param('id') id:string) {
    try {
      console.log('comment id in get comments controller ', id)
      console.log('in get comments for a particular blog controller method!')
      const comments = await this.blogCommentService.getCommentsForComment(id);
      if (comments) {
        return res.status(200).json({
          message: "Replies for Comments fetched successfully",
          data: comments
        })
      }
      else {
        return res.status(404)({
          message: "error fetching replies for the Comment!!!"
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: "server boom hogya!"
      })
    }
  }

  @Patch(':id/like')
  @UseGuards(AuthGuard('jwt'))
  async likeBlogComment(@Param('id') id: string, @UserId() userId: string, @Res() res) {
    try {
      console.log('in like blog comment controller method commentid -> ', id)
      const likeComment = await this.blogCommentService.likeBlogComment(id, userId);

      if (likeComment) {
        return res.status(200).json({
          message: 'blog liked/disliked successfully',
          data: likeComment
        })
      } else {
        return res.status(404).json({
          message: "blog comment does not exist"
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: "internal server boom hogya!"
      })
    }
  }
}
