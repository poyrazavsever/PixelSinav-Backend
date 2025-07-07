import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class TeacherApplication {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  eduInformation: string;

  @Prop({ required: true })
  experience: string;

  @Prop({ required: true })
  expertise: string;

  @Prop({ required: true })
  resume: string;

  @Prop({ required: true })
  certificates: string[];
}

export const UserSchema = SchemaFactory.createForClass(TeacherApplication);
