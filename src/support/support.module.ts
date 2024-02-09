import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { MailModule } from '../mail/mail.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { TicketModel } from './tickect.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: TicketModel,
        schemaOptions: {
          collection: 'Ticket',
        },
      },
    ]),
    MailModule,
  ],
  providers: [SupportService],
  controllers: [SupportController],
})
export class SupportModule {}
