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

  @Prop({ required: false })
  verificationToken: string;

  @Prop({ required: false, type: Date })
  verificationTokenExpires: Date;

  @Prop({ required: false })
  resetPasswordToken: string;

  @Prop({ required: false, type: Date })
  resetPasswordExpires: Date;

  @Prop({
    type: {
      showActive: { type: Boolean, default: true },
      showProfilePicture: { type: Boolean, default: true },
      showBannerPicture: { type: Boolean, default: true },
      showProfile: { type: Boolean, default: true },
      showLocation: { type: Boolean, default: true },
      showStatics: { type: Boolean, default: true },
    },
    default: {
      showActive: true,
      showProfilePicture: true,
      showBannerPicture: true,
      showProfile: true,
      showLocation: true,
      showStatics: true,
    },
  })
  privacy: PrivacyType;

  @Prop([
    {
      type: {
        type: String,
        required: true,
      },
      default: {
        type: [String],
        required: true,
      },
      period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
      },
    },
  ])
  notifications: NotificationType[];
}

export const UserSchema = SchemaFactory.createForClass(User);
