import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IAnswerTickerDto } from './interfaces/IAnswerTickerDto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MailService {
  private readonly from = 'contact@cryptoflats.io';

  constructor(private readonly mailerService: MailerService) {}

  public async answerTicket(dto: IAnswerTickerDto): Promise<void> {
    const htmlPath = path.join(
      __dirname,
      '..',
      '..',
      'templates',
      'dev-index-mail.html',
    );
    const html = fs.readFileSync(htmlPath, 'utf8');

    console.log(html.replace(/\s/g, ''));

    return await this.mailerService.sendMail({
      to: dto.to,
      from: this.from,
      subject: 'Cryptoflats Support: Response to Ticket',
      html,
    });
  }
}
