import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async sendVerificationEmail(
    email: string,
    name: string,
  ): Promise<{ token: string }> {
    try {
      const token = this.generateVerificationToken();
      const verificationLink = `http://localhost:3000/api/auth/verify/${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'E-posta Adresinizi Doğrulayın - PixelSinav',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Merhaba ${name}!</h2>
            <p>PixelSinav'a hoş geldiniz. Hesabınızı aktifleştirmek için lütfen aşağıdaki butona tıklayın:</p>
            <div style="margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color:rgb(255, 172, 29); color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 4px; display: inline-block;">
                E-posta Adresimi Doğrula
              </a>
            </div>
            <p>Veya aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
            <p>${verificationLink}</p>
            <p>Bu link 24 saat boyunca geçerlidir.</p>
            <hr style="margin: 30px 0; border: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Bu e-posta PixelSinav hesabınızla ilgili önemli bilgiler içermektedir. 
              Eğer bu hesabı siz oluşturmadıysanız, lütfen bu e-postayı dikkate almayın.
            </p>
          </div>
        `,
      });

      console.log('Doğrulama e-postası gönderildi:', {
        to: email,
        token: token.substring(0, 10) + '...',
      });

      return { token };
    } catch (error) {
      console.error('E-posta gönderme hatası:', error);
      throw error;
    }
  }
}
