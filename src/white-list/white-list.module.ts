import { Module } from '@nestjs/common';
import { WhiteListService } from './white-list.service';
import {WhiteListController} from "./white-list.controller";
import {TypegooseModule} from "nestjs-typegoose";
import {WhiteListModel} from "./white-list.model";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: WhiteListModel,
        schemaOptions: {
          collection: "WhiteList"
        }
      },
    ]),
    ConfigModule,
  ],
  providers: [WhiteListService],
  controllers: [WhiteListController],
})
export class WhiteListModule {}
