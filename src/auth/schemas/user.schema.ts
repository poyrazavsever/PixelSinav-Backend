import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

class NotificationType {
  type: string;
  default: string[];
  period: 'weekly' | 'monthly';
}

class PrivacyType {
  showActive: boolean;
  showProfilePicture: boolean;
  showBannerPicture: boolean;
  showProfile: boolean;
  showLocation: boolean;
  showStatics: boolean;
}

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  username: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  profilePicture: string;

  @Prop({ required: false })
  bannerPicture: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ required: false })
  location: string;

  @Prop({ required: false })
  bio: string;

  @Prop({ required: true })
  isVerified: boolean;

  @Prop({ type: [String], default: [] })
  roles: string[];

  @Prop({ type: [{ type: Object }], required: false })
  notifications: NotificationType[];

  @Prop({
    type: {
      showActive: { type: Boolean, required: true },
      showProfilePicture: { type: Boolean, required: true },
      showBannerPicture: { type: Boolean, required: true },
      showProfile: { type: Boolean, required: true },
      showLocation: { type: Boolean, required: true },
      showStatics: { type: Boolean, required: true },
    },
    required: true,
  })
  privacy: PrivacyType;
}

export const UserSchema = SchemaFactory.createForClass(User);
