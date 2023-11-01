import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import { Document, Model } from 'mongoose';

export type UsersDocument = Users & Document;
export type UsersModel = Model<UsersDocument>;

@Schema({ versionKey: false, timestamps: true })
export class Users {
  @Prop({ type: String })
  name: string;
  
  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  dob: string;

  @Prop({
    type: Array,
    required: true
  })
  categories: [string];
  
  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true })
  passwordSalt: string;

  @Prop({ type: String, required: true })
  passwordRound: string;

  @Prop({ type: Boolean, required: true, default: false })
  isDeleted: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
