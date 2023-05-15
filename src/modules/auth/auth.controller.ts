import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService:AuthService,
    private readonly configService:ConfigService,
  ){}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() logInDto: LoginDto){
    return this.authService.login(logInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() registerDto: CreateUserDto){
    return this.authService.register(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('confirmation')
  async confirmation(@Body() body : {token:string}){        
    return await this.authService.confirm(body.token);
  }
}
