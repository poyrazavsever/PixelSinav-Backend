import {
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
  IsArray,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateNotificationDto {
  @IsString()
  type: string;

  @IsArray()
  @IsString({ each: true })
  default: string[];

  @IsEnum(['weekly', 'monthly'])
  period: 'weekly' | 'monthly';
}

export class UpdatePrivacySettingsDto {
  @IsOptional()
  @IsBoolean()
  showActive?: boolean;

  @IsOptional()
  @IsBoolean()
  showProfilePicture?: boolean;

  @IsOptional()
  @IsBoolean()
  showBannerPicture?: boolean;

  @IsOptional()
  @IsBoolean()
  showProfile?: boolean;

  @IsOptional()
  @IsBoolean()
  showLocation?: boolean;

  @IsOptional()
  @IsBoolean()
  showStatics?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  bannerPicture?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateNotificationDto)
  notifications?: UpdateNotificationDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdatePrivacySettingsDto)
  privacy?: UpdatePrivacySettingsDto;
}
