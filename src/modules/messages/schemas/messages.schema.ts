import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';
import { Chat } from 'src/modules/chat/schemas/chat.schema';
import { User } from 'src/modules/users/schemas/users.schema';

export type MessageDocument = Message & Document;

@Schema({timestamps:true})
export class Message {
  @Prop({required:true})
  content: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required:true, autopopulate:true })
  sender_id: User;

  @Prop({ type: Date, default: Date.now, required:true })
  sent_at: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Chat', required:true,autopopulate:true})
  chat: Chat;
  
}

export const MessageSchema = SchemaFactory.createForClass(Message).plugin(require('mongoose-autopopulate'));