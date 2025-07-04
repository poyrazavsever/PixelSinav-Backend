import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto) {
    // Simüle edilmiş async işlem
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('Giriş isteği alındı:', loginDto);
    return {
      success: true,
      message: 'Giriş başarılı (test)',
      token: 'test_jwt_token_123',
      user: {
        email: loginDto.email,
        isVerified: true,
        roles: ['user'],
      },
    };
  }

  async register(userDto: UserDto) {
    // Simüle edilmiş async işlem
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('Kayıt isteği alındı:', userDto);
    return {
      success: true,
      message: 'Kullanıcı kaydı başarılı (test)',
      user: {
        ...userDto,
        isVerified: false,
        roles: ['user'],
      },
    };
  }

  async update(updateUserDto: UpdateUserDto) {
    // Simüle edilmiş async işlem
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('Güncelleme isteği alındı:', updateUserDto);
    return {
      success: true,
      message: 'Kullanıcı bilgileri güncellendi (test)',
      user: updateUserDto,
    };
  }

  async sendVerificationEmail(email: string) {
    // Simüle edilmiş async işlem
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('Doğrulama e-postası gönderiliyor:', email);

    const verificationToken = 'test_verification_token_123';
    return {
      success: true,
      message: 'Doğrulama e-postası gönderildi (test)',
      verificationLink: `http://localhost:3000/auth/verify/${verificationToken}`,
    };
  }

  async verifyEmail(token: string) {
    // Simüle edilmiş async işlem
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('E-posta doğrulama isteği alındı. Token:', token);
    return {
      success: true,
      message: 'E-posta adresi başarıyla doğrulandı (test)',
    };
  }
}
