import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class ApplicationDto {
  @IsNotEmpty({ message: 'Kullanıcı ID Alanı Boş Olamaz' })
  @IsString({ message: 'Kullanıcı ID Alanı Geçersiz' })
  userId: string;

  @IsNotEmpty({ message: 'İsim Alanı Boş Olamaz' })
  @IsString({ message: 'İsim Alanı Geçersiz' })
  name: string;

  @IsNotEmpty({ message: 'E-posta Alanı Boş Olamaz' })
  @IsEmail({}, { message: 'Geçersiz E-posta Adresi' })
  email: string;

  @IsNotEmpty({ message: 'Telefon Alanı Boş Olamaz' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Eğitim Bilgisi En Az 8 Karakter Olmalı' })
  @MaxLength(64, { message: 'Eğitim Bilgisi En Fazla 64 Karakter Olmalı' })
  eduInformation?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Deneyim Bilgisi En Az 8 Karakter Olmalı' })
  @MaxLength(600, { message: 'Deneyim Bilgisi En Fazla 600 Karakter Olmalı' })
  experience?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Uzmanlık Bilgisi En Az 8 Karakter Olmalı' })
  @MaxLength(600, { message: 'Uzmanlık Bilgisi En Fazla 600 Karakter Olmalı' })
  expertise?: string;

  @IsNotEmpty()
  @IsString()
  resume?: string;

  @IsNotEmpty()
  @IsString()
  certificates?: string[];

  @IsOptional()
  @IsBoolean({ message: 'Onay Durumu Geçersiz' })
  isApproved?: boolean;

  @IsOptional()
  @IsString({ message: 'Durum Geçersiz' })
  status?: string;
}
