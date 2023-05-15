import {  MinLength, IsBoolean,  IsOptional, IsString } from "class-validator";

export class UpdateUserDto{
  @IsOptional()
  @MinLength(4)
  @IsString()
  name?:string;

  @IsOptional()
  @IsBoolean()
  emailVerified?:boolean;

  @IsOptional()
  @IsString()
  avatar?:string;   
}