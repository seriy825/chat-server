import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  async getAll(): Promise<User[]>{
    return await this.userModel.find().exec();
  }

  async getById(id:string): Promise<User>{
    return await this.userModel.findById(id).lean().exec();
  }
  
  async getByEmail(email:string): Promise<User>{
    const user: User =  await this.userModel.findOne({email}).lean().exec();  
    return user;
  }

  async create(createUserDto:CreateUserDto): Promise<User>{
    const { email } = createUserDto;
    const user: User =  await this.userModel.findOne({email}).lean().exec();
    if (user) {
      throw new HttpException('User already exists!',HttpStatus.BAD_REQUEST);
    }    
    createUserDto.password = await bcrypt.hash(createUserDto.password,await bcrypt.genSalt());
    const newUser = new this.userModel(createUserDto);
    newUser.save();
    return newUser;
  }

  async update(id:string, updateUserDto:UpdateUserDto):Promise<User>{    
    // const user = await this.userModel.findByIdAndUpdate(id,updateUserDto,{new:true}).exec();
    return await this.userModel.findByIdAndUpdate(id,updateUserDto,{new:true}).exec();
  }

  async remove(id:string):Promise<User>{
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
