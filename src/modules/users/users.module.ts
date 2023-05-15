import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[MongooseModule.forFeature([
    {name:User.name,schema:UserSchema}
  ]),
  JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory:(config: ConfigService) =>{
      return {
        secret: config.get<string>('SECRET_KEY'),
      }
    }
  })],
  providers: [UsersService],
  controllers: [UsersController],
  exports:[UsersService]
})
export class UsersModule {}
