import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { TypegooseModule } from "nestjs-typegoose"

import { ConfigModule, ConfigService } from "@nestjs/config"
import { AuthController } from "./auth.controller"
import { JwtModule } from "@nestjs/jwt"

import { JwtStrategy } from "./strategies/jwt.strategy"
import {AdminModel} from "../admin/admin.model";
import {getJWTConfig} from "../config/jwt.config";

@Module({
  controllers: [AuthController],
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig
    })
  ],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
