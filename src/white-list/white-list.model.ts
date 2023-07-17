import {prop} from "@typegoose/typegoose";
import {Base, TimeStamps} from "@typegoose/typegoose/lib/defaultClasses";

export interface WhiteListModel extends Base{}
export class WhiteListModel extends TimeStamps {
  @prop({required:true})
  type: string
  @prop({required:true})
  name:string
  @prop()
  addresses: string[]
}