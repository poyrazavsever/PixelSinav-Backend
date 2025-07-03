import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  async register(userDto: UserDto) {
    // Simüle edilmiş async işlem
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log('Kayıt isteği alındı:', userDto);
    return {
      success: true,
      message: 'Kullanıcı kaydı başarılı (test)',
      user: userDto,
    };
  }
}
