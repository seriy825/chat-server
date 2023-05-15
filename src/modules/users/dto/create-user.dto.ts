import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString,  MinLength } from "class-validator";

export class CreateUserDto{

  @IsNotEmpty()
  @IsString()
  @MinLength(3)  
  name:string;

  @IsNotEmpty()
  @IsEmail()  
  email:string;

  @IsNotEmpty()
  @MinLength(8)  
  password:string; 
}