import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export interface TicketModel extends Base {}

export class TicketModel extends TimeStamps {
  @prop({ required: true, type: Number })
  index: number;

  @prop({ required: true, type: String })
  name: string;

  @prop({ required: true, type: String })
  description: string;

  @prop({ required: true, type: String })
  topic: string;

  @prop({ required: true, type: Boolean, default: false })
  status: boolean;

  @prop({ required: true, type: String })
  address: string;

  @prop({ required: true, type: String })
  email: string;

  @prop({ required: false, type: String })
  answer: string;
}
