import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsBoolean,
  IsString,
  IsArray,
  IsEnum,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class NotificationDto {
  @IsString()
  type: string;

  @IsArray()
  @IsString({ each: true })
  default: string[];

  @IsEnum(['weekly', 'monthly'])
  period: 'weekly' | 'monthly';
}

class PrivacyDto {
  @IsBoolean()
  showActive: boolean;

  @IsBoolean()
  showProfilePicture: boolean;

  @IsBoolean()
  showBannerPicture: boolean;

  @IsBoolean()
  showProfile: boolean;

  @IsBoolean()
  showLocation: boolean;

  @IsBoolean()
  showStatics: boolean;
}

export class UserDto {
  @IsNotEmpty({ message: 'Mail Alanı Boş Olamaz' })
  @IsEmail({}, { message: 'Yanlış Mail Formatı' })
  email: string;

  @IsNotEmpty({ message: 'Şifre Alanı Boş Olamaz' })
  @MinLength(6, { message: 'Şifre En Az 6 Karakter Olmalıdır' })
  @MaxLength(48, { message: 'Şifre En Fazla 48 Karakter Olmalıdır' })
  password: string;

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

  @IsBoolean()
  @IsNotEmpty()
  isVerified: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  roles?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationDto)
  notifications?: NotificationDto[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PrivacyDto)
  privacy: PrivacyDto;
}
