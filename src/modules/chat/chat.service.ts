import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import mongoose, { Model } from 'mongoose';
import { User } from '../users/schemas/users.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { MessagesService } from '../messages/messages.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    private messageService:MessagesService,
    private userService:UsersService
  ){}

  async getAll(user:User): Promise<Chat[]>{
    const chats:Chat[] = await this.chatModel.find( {
      users:user._id 
    }).exec();       
    for(let chat of chats){
      const last_message = await this.messageService.getMessageByChat(chat);
      chat.last_message=last_message[last_message.length-1];  
      chat.recepient = chat.users.find(u=>u._id.toString()!=user._id.toString());      
    }
    return chats;
  }

  async getByUsers(users:User[]):Promise<Chat>{
    const reversedUsers = [...users].reverse();
    return await this.chatModel.findOne( {
      $or:[
        {users},
        {users:reversedUsers}
      ]
    }).exec();
  }

  async create(createChatDto:CreateChatDto): Promise<Chat>{
    return await this.chatModel.create(createChatDto);
  }

  async remove(id:string):Promise<Chat>{
    return await this.chatModel.findByIdAndDelete(id).exec();
  }
}
