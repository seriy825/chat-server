import { IsNotEmpty } from "class-validator";
import { User } from "src/modules/users/schemas/users.schema";

export class CreateChatDto{
  @IsNotEmpty()
  readonly users:User[];
}