import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { GetTicketsDto } from './dto/get-tickets.dto';
import { AnswerTicketDto } from './dto/answer-ticket.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('/create-ticket')
  public async createTicket(@Body() dto: CreateTicketDto) {
    return await this.supportService.createTicket(dto);
  }

  @Auth()
  @Post('/answer-ticket')
  public async answerTicket(@Body() dto: AnswerTicketDto) {
    return await this.supportService.answerTicket(dto);
  }

  @Auth()
  @Get('/get-tickets')
  public async getTickets(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: GetTicketsDto,
  ) {
    return await this.supportService.getTickets(query);
  }

  @Auth()
  @Get('/get-ticket/:id')
  public async getTicket(
    @Param('id')
    id: string,
  ) {
    return await this.supportService.getTicket({ id });
  }

  @Auth()
  @Get('/get-last-ticket')
  public async getLastTicket() {
    return await this.supportService.getLastTicket();
  }
}
