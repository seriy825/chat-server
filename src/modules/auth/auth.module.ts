import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    UsersModule,
    PassportModule.register({defaultStrategy:'jwt', session:true}),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService) =>{
        return {
          secret: config.get<string>('SECRET_KEY'),
        }
      }
    }),
    MailerModule.forRootAsync({
      useFactory:async (config:ConfigService)=>({
        transport: {
          host:config.get('SMTP_HOST'),
          port:Number.parseInt(process.env.SMTP_PORT),
          secure: false,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('SMTP_USER')}>`,
        },
        template: {
          dir: process.cwd()+'/src/modules/auth/',
          adapter: new HandlebarsAdapter(), 
          options: {
            strict: true,
          },
        }
      }),
      inject:[ConfigService],   
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[JwtStrategy, PassportModule],
})
export class AuthModule {}
