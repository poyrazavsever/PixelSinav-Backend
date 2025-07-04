import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './schemas/user.schema';
import { UserDto } from './dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailService } from '../email/email.service';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
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
          'Kayıt başarılı!',
        token,
        user: {
          _id: newUser._id.toString(),
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

  // E-posta doğrulama işlemleri
  async sendVerificationEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }

      if (user.isVerified) {
        return {
          success: false,
          message: 'Bu e-posta adresi zaten doğrulanmış',
        };
      }

      const { token } = await this.emailService.sendVerificationEmail(
        email,
        user.name || 'Değerli Kullanıcı',
      );

      // Doğrulama token'ını kullanıcı belgesine kaydet
      user.verificationToken = token;
      user.verificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000,
      ); // 24 saat
      await user.save();

      return {
        success: true,
        message: 'Doğrulama e-postası gönderildi',
      };
    } catch (error) {
      console.error('E-posta gönderme hatası:', error);
      throw new UnauthorizedException('Doğrulama e-postası gönderilemedi');
    }
  }

  async verifyEmail(token: string) {
    try {
      const user = await this.userModel.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new UnauthorizedException(
          'Geçersiz veya süresi dolmuş doğrulama bağlantısı',
        );
      }

      user.isVerified = true;
      user.verificationToken = '';
      user.verificationTokenExpires = new Date(0);
      await user.save();

      return {
        success: true,
        message: 'E-posta adresi başarıyla doğrulandı',
      };
    } catch (error) {
      console.error('E-posta doğrulama hatası:', error);
      throw new UnauthorizedException(
        'E-posta doğrulama işlemi başarısız oldu',
      );
    }
  }

  async findOneById(id: string) {
    try {
      const user = await this.userModel.findById(id);
      
      if (!user) {
        throw new NotFoundException('Kullanıcı bulunamadı');
      }

      return {
        success: true,
        message: 'Kullanıcı başarıyla bulundu',
        user: {
          _id: user._id,
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
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      console.error('Kullanıcı bulma hatası:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (typeof error === 'object' && error !== null && 'name' in error) {
        if ((error as { name: string }).name === 'CastError') {
          throw new NotFoundException('Geçersiz kullanıcı ID formatı');
        }
      }

      throw new UnauthorizedException(
        'Kullanıcı bulma işlemi sırasında bir hata oluştu',
      );
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı');
      }

      const { token } = await this.emailService.sendPasswordResetEmail(
        email,
        user.name || 'Değerli Kullanıcı',
      );

      // Şifre sıfırlama token'ını kullanıcı belgesine kaydet
      const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1 saat
      
      console.log('Saving reset token:', {
        token,
        expirationDate,
        userId: user._id
      });

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expirationDate;
      await user.save();
      
      // Doğrulama için tekrar kullanıcıyı oku
      const savedUser = await this.userModel.findById(user._id);
      console.log('Saved user reset info:', savedUser ? {
        token: savedUser.resetPasswordToken,
        expires: savedUser.resetPasswordExpires
      } : 'User not found after save');

      return {
        success: true,
        message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi',
      };
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Şifre sıfırlama işlemi sırasında bir hata oluştu',
      );
    }
  }

  async resetPassword(oldPassword: string, newPassword: string, token: string) {
    try {
      console.log('Searching for token:', token);
      console.log('Current time:', new Date());
      
      // Debug için tüm reset token'ı olan kullanıcıları kontrol et
      const allUsersWithToken = await this.userModel.find({
        resetPasswordToken: { $exists: true }
      });
      console.log('Users with reset tokens:', allUsersWithToken.map(u => ({
        email: u.email,
        token: u.resetPasswordToken,
        expires: u.resetPasswordExpires
      })));

      const user = await this.userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      });

      if (!user) {
        throw new UnauthorizedException(
          'Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı',
        );
      }

      // Eski şifreyi kontrol et
      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new UnauthorizedException('Eski şifreniz yanlış');
      }

      // Yeni şifreyi hashle
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Şifreyi güncelle ve token'ları temizle
      user.password = hashedPassword;
      user.resetPasswordToken = '';
      user.resetPasswordExpires = new Date(0);
      await user.save();

      return {
        success: true,
        message: 'Şifreniz başarıyla güncellendi',
      };
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Şifre sıfırlama işlemi sırasında bir hata oluştu',
      );
    }
  }
}
