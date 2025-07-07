import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ApplicationService {
  // Test amaçlı mock data
  private applications = [
    { id: 1, userId: 1, status: 'pending', subject: 'Matematik Sınavı' },
    { id: 2, userId: 2, status: 'approved', subject: 'Fizik Sınavı' },
  ];

  apply() {
    // Test amaçlı başvuru ekleme
    const newApplication = {
      id: this.applications.length + 1,
      userId: Math.floor(Math.random() * 10) + 1, // Random userId
      status: 'pending',
      subject: 'Yeni Sınav Başvurusu',
    };
    this.applications.push(newApplication);
    return {
      message: 'Başvuru başarıyla alındı',
      application: newApplication,
    };
  }

  getAll() {
    return {
      message: 'Tüm başvurular başarıyla getirildi',
      applications: this.applications,
    };
  }

  getByUserId() {
    // Test için userId 1 olan başvuruları getir
    const userApplications = this.applications.filter(
      (app) => app.userId === 1,
    );
    return {
      message: 'Kullanıcı başvuruları başarıyla getirildi',
      applications: userApplications,
    };
  }

  approve() {
    // Test için ilk pending başvuruyu onayla
    const application = this.applications.find(
      (app) => app.status === 'pending',
    );
    if (application) {
      application.status = 'approved';
      return {
        message: 'Başvuru başarıyla onaylandı',
        application,
      };
    }
    return {
      message: 'Onaylanacak başvuru bulunamadı',
    };
  }

  updateStatus(id: string, status: string) {
    const application = this.applications.find(
      (app) => app.id === parseInt(id),
    );

    if (!application) {
      throw new NotFoundException(`ID: ${id} olan başvuru bulunamadı`);
    }

    application.status = status;
    return {
      message: 'Başvuru durumu başarıyla güncellendi',
      application,
    };
  }
}
