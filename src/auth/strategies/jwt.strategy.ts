import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test-secret-key', // Gerçek uygulamada bu değer .env'den alınmalı
    });
  }

  async validate(payload: JwtPayload) {
    try {
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Simüle edilmiş async işlem
      await new Promise((resolve) => setTimeout(resolve, 100));

      return {
        userId: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
