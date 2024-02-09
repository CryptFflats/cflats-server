import { IsNumber, IsString, Length } from 'class-validator';

export class AnswerTicketDto {
  @IsString()
  readonly id: string;

  @IsString()
  @Length(3, 1000)
  readonly answer: string;
}
