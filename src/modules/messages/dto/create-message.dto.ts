import { IsNotEmpty, IsEmpty } from "class-validator";
import mongoose from "mongoose";
import { Chat } from "src/modules/chat/schemas/chat.schema";

export class CreateMessageDto{
  @IsNotEmpty()
  readonly content:string;
  
  @IsEmpty({message:"You cannot pass conversation id."})
  readonly chat:Chat;

  @IsNotEmpty()
  readonly sender_id:mongoose.Types.ObjectId
}