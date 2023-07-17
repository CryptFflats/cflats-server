import {Body, Controller, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe} from '@nestjs/common';
import {WhiteListService} from "./white-list.service";
import {WhiteListDto} from "./dto/WhiteList.dto";

@Controller('white-list')
export class WhiteListController {
  constructor(private readonly WhiteListService: WhiteListService) {
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async createWhiteList(@Body() dto: WhiteListDto) {
    return await this.WhiteListService.createWhiteList(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put()
  async updateWhiteList(@Body() dto: WhiteListDto) {
    return await this.WhiteListService.updateAddresses(dto)
  }

  @HttpCode(200)
  @Get(':name/:type')
  async getWhiteList(@Param('name') name: string, @Param('type') type: string) {
   return  await this.WhiteListService.getWhiteList(name, type);
  }
}
