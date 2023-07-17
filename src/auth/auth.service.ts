import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { AdminModel } from "src/admin/admin.model"
import { AuthDto } from "./dto/auth.dto"
import { compare, genSalt, hash } from "bcryptjs"
import { JwtService } from "@nestjs/jwt"
import { RefreshTokenDto } from "./dto/refreshToken.dto"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AdminModel) private readonly AdminModel: ModelType<AdminModel>,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto)
    const tokens = await this.issueTokenPair(String(user._id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
  async register(dto: AuthDto) {
    const oldUser = await this.AdminModel.findOne({ login: dto.login })
    if (oldUser) {
      throw new BadRequestException("This email is already taken")
    }
    const salt = await genSalt()
    const newUser = new this.AdminModel({
      login: dto.login,
      password: await hash(dto.password, salt)
    })
    const user = await newUser.save()
    const tokens = await this.issueTokenPair(String(user._id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
  async validateUser(dto: AuthDto): Promise<AdminModel> {
    const User = await this.AdminModel.findOne({ login: dto.login })
    if (!User) {
      throw new UnauthorizedException("User not found")
    }
    const isValidPassword = await compare(dto.password, User.password)
    if (!isValidPassword) {
      throw new UnauthorizedException("Wrong password")
    }
    return User
  }
  async issueTokenPair(userId: string) {
    const data = { _id: userId }
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: "15d"
    })

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: "1h"
    })
    return { refreshToken, accessToken }
  }
  returnUserFields(user: AdminModel) {
    return {
      _id: user._id,
      login: user.login,
    }
  }
  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) {
      throw new UnauthorizedException("Sign in, bastard")
    }
    const result = await this.jwtService.verifyAsync(refreshToken)
    if (!result) {
      throw new UnauthorizedException("Invalid token or expired")
    }
    const user = await this.AdminModel.findById(result._id)
    const tokens = await this.issueTokenPair(String(user._id))
    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }
}
