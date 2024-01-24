import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  providers: [
    MailService,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: 'username',
          pass: 'password',
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
  ],
})
export class MailModule {}
