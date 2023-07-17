import { Body, Controller, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateUserDto } from "./dto/create-user.dto";
import {Auth} from "../auth/decorators/auth.decorator";

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Auth()
  @Post()
  create(@Body() userDto: CreateUserDto)  {
    return this.adminService.createUser(userDto);
  }
}
