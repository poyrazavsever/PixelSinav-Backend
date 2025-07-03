import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

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
  notifications: [
    {
      type: string;
      default: string[];
      period: 'weekly' | 'monthly';
    },
  ];

  @Prop({ required: true })
  privacy: {
    showActive: boolean;
    showProfilePicture: boolean;
    showBannerPicture: boolean;
    showProfile: boolean;
    showLocation: boolean;
    showStatics: boolean;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
