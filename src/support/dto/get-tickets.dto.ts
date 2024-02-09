import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTicketsDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  readonly page: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  readonly limit: number;
}
