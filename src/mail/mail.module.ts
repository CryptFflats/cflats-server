import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'mail.hosting.reg.ru',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: 'contact@cryptoflats.io',
          pass: 'cryptoflatsParol123',
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
