import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { User } from '../users/schemas/users.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  
  async login(logInDto: LoginDto):Promise<any>{
    const user: User = await this.usersService.getByEmail(logInDto.email);
    if (!user){
      throw new HttpException('This user is not registered in the system!',HttpStatus.BAD_REQUEST);
    }
    if (!await bcrypt.compare(logInDto.password,user.password)){
      throw new UnauthorizedException();
    }    
    return {
      access_token:await this.jwtService.signAsync(user),
    }
  }

  async register(registerDto: CreateUserDto){
    const user: User = await this.usersService.create(registerDto);
    delete user.password;
    const access_token = await this.jwtService.signAsync(user);
    const url = process.env.EMAIL_CONFIRMATION_URL+access_token;
    await this.mailService.sendMail({
      from :process.env.SMTP_USER,
      to:registerDto.email,      
      subject:'Welcome to chat! Confirm your Email!',
      template:'./views/confirmation',
      context:{
        name:registerDto.name,
        url,
      }
    });    
    return {
      access_token,
    }
  }

  async confirm(token: string):Promise<{access_token:string}>{   
    try{ 
      let user = await this.jwtService.verify(token, {
        secret: this.configService.get('SECRET_KEY'),
      });
      await this.usersService.update(user._id.toString(),{emailVerified:true});
      user = await this.usersService.getByEmail(user.email);
      const access_token = await this.jwtService.signAsync(user);
      return {
        access_token,
      };      
    }
    catch(error){
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }    
  }
}
