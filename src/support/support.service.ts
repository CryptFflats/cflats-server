import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { TicketModel } from './tickect.model';
import { InjectModel } from 'nestjs-typegoose';
import { AnswerTicketDto } from './dto/answer-ticket.dto';
import { GetTicketsDto } from './dto/get-tickets.dto';
import { GetTicketDto } from './dto/get-ticket.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SupportService {
  constructor(
    private readonly mailService: MailService,
    @InjectModel(TicketModel)
    private readonly ticketModel: ModelType<TicketModel>,
    private configService: ConfigService,
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
      html: `Thanks for contacting Cryptoflats!<br><br>We've received your message and will respond as soon as we can.<br><br>Your ticket number is: ${ticket.index}<br><br>- Cryptoflats support team`,
    });

    await this.sendNotificationTelegram(ticket);

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

  private async sendNotificationTelegram(ticket: TicketModel) {
    const BOT_TOKEN = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const CHAT_IDS = this.configService
      .get<string>('TELEGRAM_CHAT_IDS')
      .split(',');
    const BOT_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

    const message = `New ticket created: ${ticket.index}\nTopic: ${ticket.topic}\nDescription: ${ticket.description}\nAddress: ${ticket.address}\nEmail: ${ticket.email}\n\nClick here to answer: <a href="https://cryptoflats.io/admin">https://cryptoflats.io/admin</a>`;

    for (const chatId of CHAT_IDS) {
      try {
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('parse_mode', 'HTML');
        formData.append('text', message);

        await axios.post(`${BOT_URL}/sendMessage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (err) {
        console.error(`Error sending notification to chat ID ${chatId}:`, err);
      }
    }
  }
}
