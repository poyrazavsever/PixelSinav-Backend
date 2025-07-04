import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

import { User } from './schemas/user.schema';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      // E-posta ile kullanıcıyı bul
      const user = await this.userModel.findOne({ email: loginDto.email });
      if (!user) {
        throw new UnauthorizedException('E-posta adresi veya şifre hatalı');
      }

      // Şifre doğrulaması
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('E-posta adresi veya şifre hatalı');
      }

      // JWT payload hazırla
      const payload: JwtPayload = {
        sub: user._id.toString(),
        email: user.email,
        roles: user.roles,
      };

      // JWT token oluştur
      const token = this.jwtService.sign(payload);

      return {
        success: true,
        message: 'Giriş başarılı',
        token,
        user: {
          email: user.email,
          name: user.name,
          isVerified: user.isVerified,
          roles: user.roles,
          profilePicture: user.profilePicture,
          privacy: user.privacy,
        },
      };
    } catch (error) {
      // Hata yönetimi
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Giriş işlemi sırasında bir hata oluştu');
    }
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
