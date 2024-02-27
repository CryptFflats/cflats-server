import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { MailModule } from '../mail/mail.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { TicketModel } from './tickect.model';
import { ConfigModule } from '@nestjs/config';

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
    ConfigModule,
  ],
  providers: [SupportService],
  controllers: [SupportController],
})
export class SupportModule {}
