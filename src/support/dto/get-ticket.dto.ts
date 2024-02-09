import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class GetTicketDto {
  @Type(() => String)
  @IsString()
  readonly id: string;
}
