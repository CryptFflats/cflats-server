import {Body, Controller, Get, HttpCode, Param, Post, Put, Res, UsePipes, ValidationPipe} from '@nestjs/common';
import {WhiteListService} from "./white-list.service";
import {WhiteListDto} from "./dto/WhiteList.dto";
import {Auth} from "../auth/decorators/auth.decorator";
import * as createCsvWriter from 'csv-writer';
import { Response } from 'express'
import { randomHash } from '../common/utils'
import * as fs from 'fs';

@Controller('white-list')
export class WhiteListController {
  constructor(private readonly WhiteListService: WhiteListService) {}

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async createWhiteList(@Body() dto: WhiteListDto) {
    return await this.WhiteListService.createWhiteList(dto)
  }

  @Auth()
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put()
  async updateWhiteList(@Body() dto: WhiteListDto) {
    return await this.WhiteListService.updateAddresses(dto)
  }

  @HttpCode(200)
  @Get(':name/:type')
  async getWhiteList(@Param('name') name: string, @Param('type') type: string) {
   return await this.WhiteListService.getWhiteList(name, type);
  }

  @HttpCode(200)
  @Get(':name/:type/csv')
  async getCsvWhiteList(@Res() res: Response, @Param('name') name: string, @Param('type') type: string) {
    const { addresses } = await this.WhiteListService.getWhiteList(name, type);
    const hash = randomHash(0, 9, 10);
    const fileName = `${name}-${type}-${hash}.csv`;
    const title = `${name} ${type} ${new Date().toLocaleDateString()}`
    const path = `temporary/${fileName}`;

    const csvWriter = createCsvWriter.createObjectCsvWriter({
      path,
      header: [{ id: `address`, title: title }],
    });

    const records = addresses.map((address) => ({ address }));

    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);

    csvWriter.writeRecords(records)
      .then(() => {
        const file = fs.readFileSync(path);
        res.send(file).status(200).end();
        fs.unlinkSync(path);
      })
      .catch((err) => {
        res.status(500).send('Internal Server Error');
      });
  }
}
