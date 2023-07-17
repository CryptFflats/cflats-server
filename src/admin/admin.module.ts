import { Module } from '@nestjs/common';
import { AdminModel } from "./admin.model";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import {TypegooseModule} from "nestjs-typegoose";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: AdminModel,
        schemaOptions: {
          collection: "Admin"
        }
      }
    ]),
    ConfigModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
