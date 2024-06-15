/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Res, Req, UseGuards, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/cloudinary/multer.config';
import { UserId } from './fetchUserId';
import { cloudinaryHandler } from 'src/cloudinary/cloudinary.config';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@UserId() userId: string) {
    return { userId };
  }

  @Post('update-profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File, @UserId() userId: string, @Res() res) {
    try {
      console.log('in user profile picture controller method')
      console.log(file)
      // uploading on cloudinary
      var result = await cloudinaryHandler(file);
      console.log('cloudinary result ', result)
      //saving the fileUrl in database
      const updateUser = await this.usersService.updateProfilePicture(userId, result.url);
      if (updateUser) {
        res.status(200).json({
          message: "upload successful!!",
          data: updateUser
        })
      }
      else {
        res.status(404).json({
          message: "cannot upload because user not found!"
        })
      }
    } catch (error) {
      res.status(500).json({
        message: "can not upload picture!",
        error: error.message
      })
    }
  }

  @Get('details')
  @UseGuards(AuthGuard('jwt'))
  async getUserDetails(@UserId() userId: string, @Res() res) {
    try {
      console.log('user controller get details method called!')
      const user = await this.usersService.findOneById(userId);
      console.log(user)
      if (user) {
        return res.status(200).json({
          user: user,
          message: 'user fetched successfully'
        })
      }
      else {
        return res.status(404).json({
          message: 'some error occurred!'
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch user details',
        error: error.message
      })
    }
  }

  @Post('signup')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async create(@UploadedFile() file:Express.Multer.File,@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      console.log('in user controller signup')
      console.log("form data in user controller signup -> " , createUserDto)
      if(file){
        console.log(file)
        // uploading on cloudinary
        var result = await cloudinaryHandler(file);
        console.log('cloudinary result ', result)
        createUserDto.profilePicture = result.url;
      }
      const savedUser = await this.usersService.signUp(createUserDto);
      if (savedUser) {
        return res.status(201).json({
          message: 'User added successfully',
          data: savedUser,
        });
      }else{
        return res.status(404).json({
          message:"user cannot be added!"
        })
      }
    } catch (error) {
      return res.status(500).json({
        message: 'Failed to add user',
        error: error.message,
      });
    }
  }
  
  @Post('login')
  async login(@Body() loginUserDto: loginUserDto, @Req() req, @Res() res): Promise<{ token: string }> {
    console.log('in users login!')
    console.log(loginUserDto)
    const data = await this.usersService.login(loginUserDto);
    return res.status(200).json({
      message: 'Login Successfull',
      data: data
    });
  }
}
