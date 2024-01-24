import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import {getMongoDbConfig} from "./common/config/mongo.config";
import {TypegooseModule} from "nestjs-typegoose";
import { WhiteListModule } from './white-list/white-list.module';
import { SupportModule } from './support/support.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoDbConfig
    }),
    AuthModule,
    AdminModule,
    WhiteListModule,
    SupportModule,
    MailModule
  ],
})
export class AppModule {}