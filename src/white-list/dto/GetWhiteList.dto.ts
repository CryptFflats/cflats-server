import {IsString} from "class-validator";

export class GetWhiteListDto {
  @IsString()
  name: string
}