import { Controller, Post } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  async sendMail(): Promise<string> {
    return this.supportService.sendMail();
  }
}
