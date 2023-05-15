import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId, SchemaTypes } from 'mongoose';
import { Message } from 'src/modules/messages/schemas/messages.schema';
import { User } from 'src/modules/users/schemas/users.schema';

export type ChatDocument = Chat & Document;

@Schema({timestamps:true})
export class Chat {
  _id?:mongoose.Types.ObjectId;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}] ,autopopulate:true})
  users: User[];
  @Prop({type:User,ref:'User'})
  recepient?:User;
  @Prop({type:Message,ref:'Message'})
  last_message?:Message;
}
export const ChatSchema = SchemaFactory.createForClass(Chat).plugin(require('mongoose-autopopulate'));