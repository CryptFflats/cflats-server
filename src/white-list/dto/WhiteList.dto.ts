import {IsArray, IsString} from "class-validator";

export class WhiteListDto {
  @IsString()
  type: string
  @IsString()
  name: string
  @IsArray()
  addresses: string[]
}