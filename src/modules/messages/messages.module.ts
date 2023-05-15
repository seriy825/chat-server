import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/messages.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[
    AuthModule,    
    UsersModule,
    MongooseModule.forFeature([
      {name:Message.name,schema:MessageSchema}
    ])
  ],
  providers: [MessagesService],
  exports: [MessagesService]
})
export class MessagesModule {}
