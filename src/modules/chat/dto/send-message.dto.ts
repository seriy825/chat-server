import { IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";
import { User } from "src/modules/users/schemas/users.schema";

export class SendMessageDto{
  @IsNotEmpty()
  @IsString()
  readonly content:string;  

  @IsNotEmpty()
  readonly recepient:User;
}