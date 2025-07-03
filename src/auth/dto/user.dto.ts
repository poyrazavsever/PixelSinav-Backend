import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'Mail Alanı Boş Olamaz' })
  @IsEmail({}, { message: 'Yanlış Mail Formatı' })
  email: string;

  @IsNotEmpty({ message: 'Şifre Alanı Boş Olamaz' })
  @MinLength(6, { message: 'Şifre En Az 6 Karakter Olmalıdır' })
  @MaxLength(48, { message: 'Şifre En Fazla 48 Karakter Olmalıdır' })
  password: string;

  @IsNotEmpty({ message: 'İsim Alanı Boş Olamaz' })
  name: string;
}
