
import {prop} from "@typegoose/typegoose";
import {Base, TimeStamps} from "@typegoose/typegoose/lib/defaultClasses";
import {ObjectId} from "mongoose";


export interface AdminModel extends Base{}
export class AdminModel extends TimeStamps {
  @prop({required:true})
  login: string
  @prop({required:true})
  password:string
  @prop()
  isAdmin:boolean
}

export interface IAdmin {
  login: string;
  password: string;
  _id: ObjectId
}