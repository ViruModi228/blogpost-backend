import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';

@Injectable()
export class UsersService {
constructor(@InjectModel(User.name) private userModel:Model<User>,
private jwtService : JwtService) {}

  async signUp(createUserDto: CreateUserDto): Promise<{token: string}> {
    try {
      console.log('form data in user service  = ',createUserDto)
      const {first_name , last_name , email , password, profilePicture} = createUserDto;
      const hashedPassword = await bcrypt.hash(password , 10);
      const user = await this.userModel.create({
        first_name:first_name,
        last_name:last_name,
        email:email,
        password:hashedPassword,
        profilePicture:profilePicture
      })
      const token = this.jwtService.sign({id : user._id});
      return {token};
    } catch (err) {
      console.log("error in service", err);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
  
  async login(loginDto : loginUserDto):Promise<User>{
    try{
      console.log('in user login service method!')
      const {email,password} = loginDto;
      const user = await this.userModel.findOne({email});
      if(!user){
        throw new UnauthorizedException('Invalid Credentials!!');
      }
      const isPasswordMatched = await bcrypt.compare(password,user.password)
      if(!isPasswordMatched){
        throw new UnauthorizedException('Invalid Password!!')
      }
      const token = this.jwtService.sign({id:user._id})
      
      const updatedUser = await this.userModel.findByIdAndUpdate(
        user._id,
        { token },
        { new: true } 
      );

      return updatedUser;
    }catch(err){
      console.log("error in service", err);
      throw new InternalServerErrorException('Failed to login user!!');
    }
  }

  async findOneById(userId:string):Promise<User>{
    console.log('user service get details method called!')
    return this.userModel.findById(userId).exec()
  }

  async updateProfilePicture(userId:string,profilePictureUrl:string):Promise<User>{
    console.log('in user service update profile picture!')
    const user = await this.userModel.findById(userId);
    if(user){
      user.profilePicture = profilePictureUrl;
      return user.save();
    }
    else{
      throw new NotFoundException('user not found!')
    }
  }
}
