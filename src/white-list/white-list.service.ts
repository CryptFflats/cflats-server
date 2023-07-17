import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {ModelType} from "@typegoose/typegoose/lib/types";
import {WhiteListDto} from "./dto/WhiteList.dto";
import {WhiteListModel} from "./white-list.model";
import {InjectModel} from "nestjs-typegoose";
import {UpdateWhiteListDto} from "./dto/UpdateWhiteList.dto";
import {GetWhiteListDto} from "./dto/GetWhiteList.dto";

@Injectable()
export class WhiteListService {
  constructor(
    @InjectModel(WhiteListModel) private readonly WhiteListModel: ModelType<WhiteListModel>
  ) {}

  createWhiteList = async (dto: WhiteListDto) => {
    const createdWhiteList = await new this.WhiteListModel(dto);
    return await createdWhiteList.save();
  }

  updateAddresses = async (dto: WhiteListDto) => {
    const { name, addresses, type } = dto;
    const whiteList = await this.WhiteListModel.findOne({ name, type });

    if (!whiteList) {
      throw new HttpException('White List Not Found', HttpStatus.NOT_FOUND);
    }

    await whiteList.addresses.push(...addresses);

    return await whiteList.save();
  }

  getWhiteList = async (name: string, type: string) => {
    const whiteList = await this.WhiteListModel.findOne({ name, type });

    if (!whiteList) {
      throw new HttpException('White List Not Found', HttpStatus.NOT_FOUND);
    }

    return whiteList;
  }
}
