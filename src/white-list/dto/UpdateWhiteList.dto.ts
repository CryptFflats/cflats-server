import {IsArray, IsString} from "class-validator";

export class UpdateWhiteListDto {
  @IsString()
  name: string
  @IsArray()
  addresses: string[]
}