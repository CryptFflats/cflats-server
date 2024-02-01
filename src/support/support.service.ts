import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SupportService {
  constructor(private readonly mailService: MailService) {}

  async sendMail(): Promise<string> {
    await this.mailService.answerTicket({
      to: 'x.tobor.x@gmail.com',
      answer: 'answer',
    });
    return 'success';
  }
}
