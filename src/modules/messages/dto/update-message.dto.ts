import { IsNotEmpty } from "class-validator";

export class UpdateMessageDto{

  @IsNotEmpty()
  content:string;
  
  @IsNotEmpty()
  sent_at:Date;
  
}