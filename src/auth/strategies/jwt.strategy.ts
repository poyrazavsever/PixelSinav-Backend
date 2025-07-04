import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test-secret-key', // Gerçek uygulamada bu değer .env'den alınmalı
    });
  }

  async validate(payload: JwtPayload) {
    try {
      console.log('JWT Payload:', payload); // Debug log

      if (!payload || !payload.email || !payload.sub) {
        console.log('Invalid payload structure:', payload); // Debug log
        throw new UnauthorizedException('Invalid token payload');
      }

      // Kullanıcının veritabanında hala mevcut olduğunu kontrol et
      const user = await this.userModel.findById(payload.sub);
      console.log('Found user:', user ? 'Yes' : 'No'); // Debug log

      if (!user) {
        console.log('User not found for id:', payload.sub); // Debug log
        throw new UnauthorizedException('User not found');
      }

      // Token'daki email ile veritabanındaki email'in eşleştiğini kontrol et
      if (user.email !== payload.email) {
        console.log('Email mismatch. Token:', payload.email, 'DB:', user.email); // Debug log
        throw new UnauthorizedException('Invalid token');
      }

      return {
        userId: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
      };
    } catch (error) {
      console.error('JWT validation error:', error); // Debug log
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
