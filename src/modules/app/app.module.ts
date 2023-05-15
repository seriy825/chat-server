import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { MessagesModule } from '../messages/messages.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      cache:true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    ChatModule,
    MessagesModule,
    MulterModule.register({
      dest:'./files',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
