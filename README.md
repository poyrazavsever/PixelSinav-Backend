<div align="center">
  <img src="https://raw.githubusercontent.com/poyrazavsever/PixelSinav-Frontend/refs/heads/master/public/logo/logo.png" alt="Pixel Sınav Logo" width="200">
  <h1>Pixel Sınav</h1>
</div>

# Pixel Sınav Backend

Merhaba! Ben bu projeyi öğrenme yolculuğumun bir parçası olarak geliştiriyorum. Modern web teknolojilerini derinlemesine öğrenmek ve gerçek dünya problemlerine çözümler üretmek için bu projeyi başlattım. Her yeni özellik, her yeni endpoint benim için yeni bir öğrenme fırsatı! 🚀

## Proje Hakkında

Bu proje, öğrencilerin online sınav deneyimini daha interaktif ve eğlenceli hale getirmeyi amaçlayan bir platformun backend kısmıdır. NestJS framework'ü ile modern ve ölçeklenebilir bir API geliştirmeyi hedefliyorum.

## Kullanılan Teknolojiler

<div align="center">
  <p>
    <img src="https://skillicons.dev/icons?i=ts" alt="TypeScript" title="TypeScript" />
    <img src="https://skillicons.dev/icons?i=nodejs" alt="Node.js" title="Node.js" />
    <img src="https://skillicons.dev/icons?i=nestjs" alt="NestJS" title="NestJS" />
    <img src="https://skillicons.dev/icons?i=mongodb" alt="MongoDB" title="MongoDB" />
    <img src="https://skillicons.dev/icons?i=jest" alt="Jest" title="Jest" />
    <img src="https://skillicons.dev/icons?i=docker" alt="Docker" title="Docker" />
  </p>
</div>

## Teknik Detaylar

- **Framework**: NestJS - Modern, ölçeklenebilir Node.js web uygulamaları için
- **Dil**: TypeScript - Tip güvenliği ve daha iyi geliştirici deneyimi için
- **Veritabanı**: MongoDB - Esnek ve ölçeklenebilir NoSQL veritabanı
- **Authentication**: JWT (JSON Web Tokens) - Güvenli kullanıcı oturumları için
- **API Documentation**: Swagger/OpenAPI - API dokümantasyonu için
- **Testing**: Jest - Unit ve integration testleri için
- **Package Manager**: pnpm - Hızlı ve disk dostu paket yönetimi

## Özellikler

- [x] JWT tabanlı kullanıcı kimlik doğrulama
- [x] E-posta doğrulama sistemi
- [x] Kullanıcı profil yönetimi
- [ ] Sınav oluşturma ve yönetme
- [ ] Sonuç analizi ve raporlama
- [ ] Gerçek zamanlı bildirimler
- [ ] Admin paneli

## Öğrenme Hedeflerim

Bu projede öğrenmeye çalıştığım konular:

1. NestJS best practices
2. Clean Architecture prensipleri
3. Mikroservis mimarisi
4. Test Driven Development (TDD)
5. CI/CD pipeline kurulumu
6. Docker containerization
7. MongoDB aggregation framework

## Başlangıç

```bash
# Projeyi klonlayın
git clone https://github.com/yourusername/pixelsinav-backend.git

# Bağımlılıkları yükleyin
pnpm install

# Development modunda çalıştırın
pnpm run start:dev
```

## API Documentation
<details>
<summary><strong>📚 API Dokümantasyonunu Görüntüle</strong></summary>

### Authentication Endpoints
<details>
<summary><strong>🔐 Authentication API Endpoints</strong></summary>

#### `POST /auth/register`
Yeni bir kullanıcı kaydı oluşturur.
```json
// Request
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "User Name",
  "roles": ["user"]  // Optional, default: ["user"]
}

// Response - 201 Created
{
  "message": "Kullanıcı başarıyla oluşturuldu",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "roles": ["user"]
  }
}
```

#### `POST /auth/login`
Kullanıcı girişi yapar ve JWT token döner.
```json
// Request
{
  "email": "user@example.com",
  "password": "secure_password"
}

// Response - 200 OK
{
  "message": "Giriş başarılı",
  "access_token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "roles": ["user"]
  }
}
```

#### `PUT /auth/update`
Kullanıcı bilgilerini günceller. JWT token gereklidir.
```json
// Header
Authorization: Bearer jwt_token

// Request
{
  "name": "New Name",
  "password": "new_password"  // Optional
}

// Response - 200 OK
{
  "message": "Kullanıcı bilgileri güncellendi",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "New Name"
  }
}
```

#### `POST /auth/verify-email`
E-posta adresini doğrular.
```json
// Request
{
  "token": "verification_token"
}

// Response - 200 OK
{
  "message": "E-posta başarıyla doğrulandı"
}
```

</details>

### Lessons Endpoints
<details>
<summary><strong>📚 Lessons API Endpoints</strong></summary>

#### `POST /lessons`
Yeni bir ders oluşturur. Teacher rolü gereklidir.
```json
// Header
Authorization: Bearer jwt_token

// Request
{
  "title": "Ders Başlığı",
  "category": "backend-development",
  "difficultyLevel": "INTERMEDIATE",
  "tags": ["nodejs", "typescript"],
  "image": "image_url",
  "description": "Ders açıklaması",
  "sections": [
    {
      "title": "Bölüm 1",
      "content": "Markdown içerik",
      "description": "Bölüm açıklaması",
      "order": 1,
      "xpPoints": 1000
    }
  ]
}

// Response - 201 Created
{
  "message": "Ders başarıyla oluşturuldu",
  "lesson": {
    "id": "lesson_id",
    "title": "Ders Başlığı",
    // ... diğer alanlar
  }
}
```

#### `GET /lessons`
Tüm dersleri listeler.
```json
// Response - 200 OK
{
  "message": "Dersler başarıyla getirildi",
  "lessons": [
    {
      "id": "lesson_id",
      "title": "Ders Başlığı",
      // ... diğer alanlar
    }
  ]
}
```

#### `GET /lessons/:id`
Belirli bir dersin detaylarını getirir.
```json
// Response - 200 OK
{
  "message": "Ders başarıyla getirildi",
  "lesson": {
    "id": "lesson_id",
    "title": "Ders Başlığı",
    // ... tüm ders detayları
  }
}
```

#### `PUT /lessons/:id`
Dersi günceller. Dersin sahibi olan öğretmen rolü gereklidir.
```json
// Header
Authorization: Bearer jwt_token

// Request
{
  "title": "Yeni Başlık",
  // ... güncellenecek alanlar
}

// Response - 200 OK
{
  "message": "Ders başarıyla güncellendi",
  "lesson": {
    // ... güncellenmiş ders bilgileri
  }
}
```

#### `DELETE /lessons/:id`
Dersi siler. Dersin sahibi olan öğretmen rolü gereklidir.
```json
// Header
Authorization: Bearer jwt_token

// Response - 200 OK
{
  "message": "Ders başarıyla silindi"
}
```

#### `GET /lessons/teacher/:teacherId`
Belirli bir öğretmenin derslerini listeler.
```json
// Response - 200 OK
{
  "message": "Öğretmenin dersleri başarıyla getirildi",
  "lessons": [
    // ... öğretmenin dersleri
  ]
}
```

</details>

### Validasyon Kuralları
<details>
<summary><strong>✅ Validasyon Kuralları</strong></summary>

#### Ders Oluşturma/Güncelleme
- `title`: 3-100 karakter arası
- `description`: 10-2000 karakter arası
- `category`: Boş olamaz
- `difficultyLevel`: BEGINNER, INTERMEDIATE, ADVANCED
- `tags`: En az 1 etiket
- `sections`: En az 1 bölüm
  - `title`: 3-100 karakter
  - `content`: En az 10 karakter (Markdown)
  - `description`: 10-1000 karakter
  - `order`: Minimum 1
  - `xpPoints`: 0-5000 arası

</details>

### Hata Kodları
<details>
<summary><strong>❌ Hata Kodları</strong></summary>

- `400 Bad Request`: Geçersiz istek formatı veya validasyon hatası
- `401 Unauthorized`: Kimlik doğrulama hatası
- `403 Forbidden`: Yetkilendirme hatası
- `404 Not Found`: Kaynak bulunamadı
- `500 Internal Server Error`: Sunucu hatası

</details>

### Authorization
<details>
<summary><strong>🔒 Authorization</strong></summary>

Çoğu endpoint JWT tabanlı kimlik doğrulaması gerektirir. Token'ı header'da gönderin:
```http
Authorization: Bearer your_jwt_token
```

</details>

### Rate Limiting
<details>
<summary><strong>⚡ Rate Limiting</strong></summary>

API rate limiting uygulanmıştır:
- Anonim istekler: 100 istek/saat
- Kimliği doğrulanmış istekler: 1000 istek/saat

</details>

## Katkıda Bulunma

Bu bir öğrenme projesi olduğu için her türlü geri bildirime açığım! İyileştirmeler, öneriler veya yeni fikirler için lütfen issue açın veya pull request gönderin.

## Öğrenme Kaynakları

Projeyi geliştirirken faydalandığım kaynaklar:

- [NestJS Resmi Dokümantasyon](https://docs.nestjs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JWT.io](https://jwt.io/)

## İletişim

Soru, öneri veya iş birliği için benimle iletişime geçebilirsiniz:

- LinkedIn: [https://www.linkedin.com/in/poyrazavsever]
- Email: poyrazavsever@gmail.com


## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

---

  ⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
  🌱 Burası sürekli öğrenme ve gelişme yolculuğunda bir durak... Mentörlük yapmak, destek olmak, tavsiye vermek isterseniz [buradan](https://www.pavsever.com) bana ulaşın.
