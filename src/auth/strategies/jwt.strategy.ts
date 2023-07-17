import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { InjectModel } from "nestjs-typegoose"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { Injectable } from "@nestjs/common"
import {AdminModel} from "../../admin/admin.model";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(AdminModel)
    private readonly AdminModel: ModelType<AdminModel>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET")
    })
  }
  async validate({ _id }: Pick<AdminModel, "_id">) {
    return await this.AdminModel.findById(_id).exec()

  }
}
