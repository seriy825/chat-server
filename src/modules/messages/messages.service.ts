import { Injectable } from '@nestjs/common';
import { Message, MessageDocument } from './schemas/messages.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Chat } from '../chat/schemas/chat.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ){}

  async getAll(chat:mongoose.Types.ObjectId): Promise<Message[]>{
    return await this.messageModel.find({chat}).exec();
  }

  async getMessageByChat(chat: Chat): Promise<Message[]>{
    return await this.messageModel.find({chat}).exec();
  }

  async create(createMessageDto:CreateMessageDto,): Promise<Message>{ 
    return await this.messageModel.create(createMessageDto);
  }

  async update(id:string, updateMessageDto:UpdateMessageDto):Promise<Message>{
    return await this.messageModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id),updateMessageDto).exec();
  }

  async remove(id:string):Promise<Message>{
    return await this.messageModel.findByIdAndDelete(id).exec();
  }
}
