import { SchemaFactory } from '@nestjs/mongoose/dist/factories';
import { Prop, Schema } from '@nestjs/mongoose/dist/decorators';
import mongoose, { Document, Model } from 'mongoose';

export type FilmsDocument = Films & Document;
export type FilmsModel = Model<FilmsDocument>;

@Schema({ versionKey: false, timestamps: true })
export class Films {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Date, required: true })
  releaseDate: Date;

  @Prop({
    type: String,
    required: false,
  })
  category: string;
}

export const FilmsSchema = SchemaFactory.createForClass(Films);
