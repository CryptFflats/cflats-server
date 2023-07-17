import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import {AdminModel, IAdmin} from "./admin.model";
import { CreateUserDto } from "./dto/create-user.dto";
import {ModelType} from "@typegoose/typegoose/lib/types";


@Injectable()
export class AdminService {
  constructor(
      @InjectModel('AdminModel') private readonly AdminModel: ModelType<AdminModel>,
  ) {}

  async createUser  (dto: CreateUserDto) {
    const createdAdmin = await new this.AdminModel(dto);
    return await createdAdmin.save();
  }

  async getUserByLogin(login: string): Promise<IAdmin>  {
    return  this.AdminModel.findOne({login});
  }
}
