import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Chat.name,schema:ChatSchema}
    ]),
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config: ConfigService) =>{
        return {
          secret: config.get<string>('SECRET_KEY'),
        }
      }
    }),
    MessagesModule,
    UsersModule
  ],
  providers: [ChatService, ChatGateway],
  exports:[ChatService]
})
export class ChatModule {}
