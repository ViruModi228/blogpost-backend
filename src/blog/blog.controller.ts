/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from 'src/users/fetchUserId';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/cloudinary/multer.config';
import { cloudinaryHandler } from 'src/cloudinary/cloudinary.config';


@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createBlogDto: CreateBlogDto, @UserId() userId: string, @Res() res) {
    try {
      console.log('in create blog controller')
      console.log('user id', userId)
      console.log('formdata in create blog controller ', createBlogDto)
      if (file) {
        console.log(file)
        // uploading on cloudinary
        var result = await cloudinaryHandler(file);
        console.log('cloudinary result ', result)
        //saving the fileUrl in database
        createBlogDto.blogPicture = result.url;
      }
      const newBlog = await this.blogService.create({ ...createBlogDto, userId });
      return res.status(201).json({
        message: "Blog created successfully",
        data: newBlog
      });
    } catch (error) {
      return res.status(400).json({
        message: "Login First: " + error.message
      });
    }
  }

  @Get('getAllBlogs')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Res() res) {
    console.log("Find all method called");
    const allBlogs = await this.blogService.findAll();
    if (allBlogs) {
      res.status(200).json({
        message: "blogs fetched successfully",
        data: allBlogs
      })
    } else {
      res.status(400).json({
        message: "Login first!"
      })
    }
  }

  @Get('getAllBlogs/user')
  @UseGuards(AuthGuard('jwt'))
  async findAllBlogsUser(@Res() res,@UserId() userId : string) {
    console.log("Find all blogs for particular user method called");
    const allBlogs = await this.blogService.findAllForUser(userId);
    if (allBlogs) {
      res.status(200).json({
        message: "blogs for user fetched successfully",
        data: allBlogs
      })
    } else {
      res.status(400).json({
        message: "Login first!"
      })
    }
  }

  @Patch(':id/like')
  @UseGuards(AuthGuard('jwt'))
  async likeBlog(@Param('id') id: number, @UserId() userId: string, @Res() res) {
    try {
      const updatedBlog = await this.blogService.likeBlog(id, userId);
      return res.status(200).json({
        message: 'Blog liked/Disliked successfully',
        data: updatedBlog
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  @Get(':id/getlikes')
  @UseGuards(AuthGuard('jwt'))
  async getLikesofBlog(@Param('id') id: number, @UserId() userId: string, @Res() res) {
    try {
      console.log('blog id in get blog likes controller method' , id)
      const getLikes = await this.blogService.getBlogLikes(id,userId);

      if(getLikes){
        return res.status(200).json({
          message:"likes of blog fetched successfully",
          data:getLikes
        })
      }else{
        return res.status(404).json({
          message:"error fetching blog likes"
        })
      }
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  @Patch(':id/update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async updateBlog(@Param('id') id: string, @Res() res, @UploadedFile() file: Express.Multer.File, @Body() updateBlogDto: UpdateBlogDto) {
    try {
      console.log('in update blog dto controller method')
      console.log('update blog dto = ', updateBlogDto)
      // Checking if any file is present
      if (file) {
        console.log("file -> ", file)
        // cloudinary update
        const result = await cloudinaryHandler(file)
        console.log('cloudinary result => ', result)
        updateBlogDto.blogPicture = result.url;
      }
      // database update
      const updatedBlog = await this.blogService.update(id, updateBlogDto);
      if (updatedBlog) {
        return res.status(200).json({
          message: "blog updated successfully",
          data: updatedBlog
        })
      }
      else {
        return res.status(404).json({
          message: "failed to update blog"
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: "internal server boom hogya!"
      })
    }
  }

  @Delete(":id/delete")
  @UseGuards(AuthGuard('jwt'))
  async deleteBlog(@Param('id') id: string, @Res() res, @UserId() userId: string) {
    try {
      console.log('in delete blog controller method')
      console.log('blog id -> ', id)
      const deleteBlog = await this.blogService.delete(id);
      if(deleteBlog){
        return res.status(200).json({
          message:"blog deleted successfully"
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: 'login first! authorization error'
      })
    }
  }
}
