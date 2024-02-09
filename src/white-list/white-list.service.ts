import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { WhiteListDto } from './dto/WhiteList.dto';
import { WhiteListModel } from './white-list.model';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class WhiteListService {
  constructor(
    @InjectModel(WhiteListModel)
    private readonly WhiteListModel: ModelType<WhiteListModel>,
  ) {}

  public createWhiteList = async (dto: WhiteListDto) => {
    const createdWhiteList = await new this.WhiteListModel(dto);
    return await createdWhiteList.save();
  };

  public updateAddresses = async (dto: WhiteListDto) => {
    const { name, addresses, type } = dto;
    const whiteList = await this.WhiteListModel.findOne({ name, type });

    if (!whiteList) {
      throw new HttpException('White List Not Found', HttpStatus.NOT_FOUND);
    }

    whiteList.addresses.push(...addresses);

    return whiteList.save();
  };

  public getWhiteList = async (name: string, type: string) => {
    const whiteList = await this.WhiteListModel.findOne({ name, type });

    if (!whiteList) {
      throw new HttpException('White List Not Found', HttpStatus.NOT_FOUND);
    }

    return whiteList;
  };

  public deleteAddressFromWhiteList = async (
    name: string,
    type: string,
    address: string,
  ) => {
    const whiteList = await this.WhiteListModel.findOne({ name, type });

    if (!whiteList) {
      throw new HttpException('White List Not Found', HttpStatus.NOT_FOUND);
    }

    const index = whiteList.addresses.indexOf(address);

    if (index === -1) {
      throw new BadRequestException('Address Not Found');
    }

    whiteList.addresses.splice(index, 1);

    await whiteList.save();

    return {
      message: 'Address deleted successfully',
    };
  };
}
