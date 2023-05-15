import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/users.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {

  constructor(private readonly userService:UsersService,
    private jwtService:JwtService){}

  @Get()
  getAll():Promise<User[]> { 
    return this.userService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string):Promise<User>{
    return this.userService.getById(id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto:CreateUserDto):Promise<User>{
    return this.userService.create(createUserDto);
  }
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('avatar',{
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        }
      }),
    })
  )
  async update(@Param('id') id: string, @Body() updateUserDto:UpdateUserDto,@UploadedFile() file: Express.Multer.File):Promise<any>{    
    await this.userService.update(id,{...updateUserDto,avatar:file.filename});
    const user = await this.userService.getById(id);
    delete user.password;
    const access_token = await this.jwtService.signAsync(user) 
    return {
      access_token
    }
    
  }
  @Delete(':id')
  remove(@Param('id') id: string):Promise<User>{
    return this.userService.remove(id);
  }
}
