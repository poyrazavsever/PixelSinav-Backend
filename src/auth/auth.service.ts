import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

  // login işlemi
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
      const accessToken = this.jwtService.sign(payload);

      // Kullanıcı bilgilerini hazırla (password hariç)
      const userResponse = {
        _id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        isVerified: user.isVerified,
      };

      return {
        success: true,
        message: 'Giriş başarılı',
        accessToken,
        user: userResponse,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Giriş işlemi sırasında bir hata oluştu');
    }
  }

  // Kullanıcı kaydı işlemi
  async register(userDto: UserDto) {
    try {
      // Email kontrolü
      const existingUser = await this.userModel.findOne({
        email: userDto.email,
      });
      if (existingUser) {
        throw new UnauthorizedException('Bu e-posta adresi zaten kullanımda');
      }

      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      // Yeni kullanıcı oluştur
      const newUser = new this.userModel({
        ...userDto,
        password: hashedPassword,
        isVerified: false,
        roles: ['user'],
        privacy: {
          showActive: true,
          showProfilePicture: true,
          showBannerPicture: true,
          showProfile: true,
          showLocation: true,
          showStatics: true,
        },
      });

      // Kullanıcıyı kaydet
      await newUser.save();

      // JWT payload hazırla
      const payload: JwtPayload = {
        sub: newUser._id.toString(),
        email: newUser.email,
        roles: newUser.roles,
      };

      // JWT token oluştur
      const token = this.jwtService.sign(payload);

      // Başarılı yanıt dön
      return {
        success: true,
        message:
          'Kayıt başarılı! E-posta doğrulaması için gelen kutunuzu kontrol edin.',
        token,
        user: {
          email: newUser.email,
          name: newUser.name,
          isVerified: newUser.isVerified,
          roles: newUser.roles,
          profilePicture: newUser.profilePicture,
          privacy: newUser.privacy,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Kayıt işlemi sırasında bir hata oluştu');
    }
  }

  // Kullanıcı bilgi güncelleme işlemi
  async update(updateUserDto: UpdateUserDto, userId: string) {
    try {
      // Kullanıcıyı bul
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }

      // Kullanıcı bilgilerini güncelle
      if (updateUserDto.username) user.username = updateUserDto.username;
      if (updateUserDto.name) user.name = updateUserDto.name;
      if (updateUserDto.profilePicture)
        user.profilePicture = updateUserDto.profilePicture;
      if (updateUserDto.bannerPicture)
        user.bannerPicture = updateUserDto.bannerPicture;
      if (updateUserDto.location) user.location = updateUserDto.location;
      if (updateUserDto.bio) user.bio = updateUserDto.bio;

      // Privacy ayarlarını güncelle
      if (updateUserDto.privacy) {
        user.privacy = {
          ...user.privacy,
          ...updateUserDto.privacy,
        };
      }

      // Bildirimleri güncelle
      if (updateUserDto.notifications) {
        updateUserDto.notifications.forEach((newNotification) => {
          const existingNotificationIndex = user.notifications.findIndex(
            (n) => n.type === newNotification.type,
          );

          if (existingNotificationIndex > -1) {
            // Mevcut bildirimi güncelle
            user.notifications[existingNotificationIndex] = {
              ...user.notifications[existingNotificationIndex],
              ...newNotification,
            };
          } else {
            // Yeni bildirim ekle
            user.notifications.push(newNotification);
          }
        });
      }

      // Son güncelleme zamanını ayarla
      user.updatedAt = new Date();

      // Değişiklikleri kaydet
      await user.save();

      return {
        success: true,
        message: 'Kullanıcı bilgileri başarıyla güncellendi',
        user: {
          email: user.email,
          username: user.username,
          name: user.name,
          profilePicture: user.profilePicture,
          bannerPicture: user.bannerPicture,
          location: user.location,
          bio: user.bio,
          isVerified: user.isVerified,
          roles: user.roles,
          notifications: user.notifications,
          privacy: user.privacy,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error: unknown) {
      console.error('Güncelleme hatası:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (typeof error === 'object' && error !== null && 'name' in error) {
        if ((error as { name: string }).name === 'ValidationError') {
          throw new UnauthorizedException('Geçersiz veri formatı');
        }

        if ((error as { name: string }).name === 'CastError') {
          throw new UnauthorizedException('Geçersiz kullanıcı ID');
        }
      }

      throw new UnauthorizedException(
        'Güncelleme işlemi sırasında bir hata oluştu',
      );
    }
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
