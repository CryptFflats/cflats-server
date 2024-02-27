import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { TicketModel } from './tickect.model';
import { InjectModel } from 'nestjs-typegoose';
import { AnswerTicketDto } from './dto/answer-ticket.dto';
import { GetTicketsDto } from './dto/get-tickets.dto';
import { GetTicketDto } from './dto/get-ticket.dto';

@Injectable()
export class SupportService {
  constructor(
    private readonly mailService: MailService,
    @InjectModel(TicketModel)
    private readonly ticketModel: ModelType<TicketModel>,
  ) {}

  public async createTicket(dto: CreateTicketDto) {
    const { description, topic, address, email } = dto;

    const count = await this.ticketModel.countDocuments();

    const ticket = new this.ticketModel({
      description,
      topic,
      address,
      email,
      index: count + 1,
    });
    await ticket.save();

    await this.mailService.sendMail({
      to: email,
      html: `Your ticket has been created successfully. Your ticket number is #${ticket.index}`,
    });

    return {
      message: 'Ticket created successfully',
    };
  }

  public async answerTicket(dto: AnswerTicketDto) {
    const { id, answer } = dto;

    const ticket = await this.ticketModel.findById(id).exec();

    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    }

    if (ticket.status) {
      throw new HttpException(
        'Ticket already answered',
        HttpStatus.BAD_REQUEST,
      );
    }

    ticket.answer = answer;
    ticket.status = true;

    await this.mailService.sendAnswerMail({
      to: ticket.email,
      answer,
    });

    await ticket.save();

    return {
      message: 'Ticket answered successfully',
    };
  }

  public async getTickets(dto: GetTicketsDto) {
    let { page, limit } = dto;
    page = page || 1;
    limit = limit || 10;
    const total = await this.ticketModel.countDocuments();
    const offset = (page - 1) * limit;

    const tickets = await this.ticketModel
      .find()
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1, status: 1 })
      .select('index status')
      .exec();
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    const data = {
      info: {
        totalItems: total,
        totalPages,
        hasNext,
        hasPrevious,
      },
      items: tickets,
    };

    return data;
  }

  public async getTicket(dto: GetTicketDto) {
    const { id } = dto;
    const ticket = await this.ticketModel.findById(id).exec();

    if (!ticket) {
      throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    }

    return ticket;
  }

  public getLastTicket() {
    return this.ticketModel.findOne().sort({ createdAt: -1 }).exec();
  }
}
