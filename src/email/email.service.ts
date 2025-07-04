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
              <form id="verifyForm" method="POST" action="${verificationLink}" style="display: inline-block;">
                <button type="submit" 
                  style="background-color:rgb(255, 172, 29); color: white; padding: 12px 24px; 
                         border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                  E-posta Adresimi Doğrula
                </button>
              </form>
            </div>
            <p>Veya aşağıdaki linki kullanarak manuel doğrulama yapabilirsiniz:</p>
            <p style="color: #666;">
              <code>POST ${verificationLink}</code>
            </p>
            <p>Bu link 24 saat boyunca geçerlidir.</p>
            <hr style="margin: 30px 0; border: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Bu e-posta PixelSinav hesabınızla ilgili önemli bilgiler içermektedir. 
              Eğer bu hesabı siz oluşturmadıysanız, lütfen bu e-postayı dikkate almayın.
            </p>
            
            <script>
              // Tarayıcı JavaScript'i desteklemiyorsa form normal şekilde POST yapacak
              // JavaScript varsa fetch API ile daha iyi bir deneyim sunacak
              document.getElementById('verifyForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                try {
                  const response = await fetch('${verificationLink}', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                  const result = await response.json();
                  if (result.success) {
                    alert('E-posta adresiniz başarıyla doğrulandı!');
                    window.location.href = 'http://localhost:3000/login';
                  } else {
                    alert('Doğrulama işlemi başarısız oldu. Lütfen tekrar deneyin.');
                  }
                } catch (error) {
                  alert('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
                }
              });
            </script>
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

  async sendPasswordResetEmail(
    email: string,
    name: string,
  ): Promise<{ token: string }> {
    try {
      const token = this.generateVerificationToken();
      const resetLink = `http://localhost:3001/auth/reset-password/${token}`;

      await this.mailerService.sendMail({
        to: email,
        subject: 'Şifre Sıfırlama - PixelSinav',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Merhaba ${name}!</h2>
            <p>PixelSinav hesabınız için şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
            <div style="margin: 30px 0;">
              <a href="${resetLink}" 
                style="background-color:rgb(255, 172, 29); color: white; padding: 12px 24px; 
                       border: none; border-radius: 4px; cursor: pointer; font-size: 16px; text-decoration: none;">
                Şifremi Sıfırla
              </a>
            </div>
            <p>Veya aşağıdaki linki kullanarak manuel olarak sıfırlama sayfasına gidebilirsiniz:</p>
            <p style="color: #666;">
              <code>${resetLink}</code>
            </p>
            <p>Bu link 1 saat boyunca geçerlidir.</p>
            <hr style="margin: 30px 0; border: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Eğer böyle bir talepte bulunmadıysanız, bu e-postayı güvenle görmezden gelebilirsiniz.
              Hesabınızın güvenliği bizim için önemlidir.
            </p>
          </div>
        `,
      });

      console.log('Şifre sıfırlama e-postası gönderildi:', {
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
