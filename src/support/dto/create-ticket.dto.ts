import { IsEmail, IsString, Length } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @Length(3, 20)
  readonly name: string;

  @IsString()
  @Length(10, 400)
  readonly description: string;

  @IsString()
  @Length(3, 40)
  readonly topic: string;

  @IsString()
  readonly address: string;

  @IsEmail()
  readonly email: string;
}
