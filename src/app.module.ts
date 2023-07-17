import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import {getMongoDbConfig} from "./config/mongo.config";
import {TypegooseModule} from "nestjs-typegoose";
import { WhiteListModule } from './white-list/white-list.module';

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
    WhiteListModule
  ],
})
export class AppModule {}