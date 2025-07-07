import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeacherApplication } from './schemas/application.schema';
import { ApplicationDto } from './dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(TeacherApplication.name)
    private teacherApplicationModel: Model<TeacherApplication>,
  ) {}

  async apply(
    applicationDto: ApplicationDto,
  ): Promise<{ message: string; application: TeacherApplication }> {
    try {
      const application = new this.teacherApplicationModel({
        ...applicationDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'Başvuru Süreciniz Devam Ediyor',
        isApproved: false,
      });

      await application.save();

      return {
        message: 'Başvurunuz başarıyla alındı',
        application,
      };
    } catch (error: any) {
      throw new Error(
        'Başvuru kaydedilirken bir hata oluştu: ' +
          (error && typeof error === 'object' && 'message' in error
            ? (error as { message: string }).message
            : String(error)),
      );
    }
  }

  async getAll() {
    const applications = await this.teacherApplicationModel.find().exec();
    return {
      message: 'Tüm başvurular başarıyla getirildi',
      applications,
    };
  }

  async getByUserId(userId: number) {
    const userApplications = await this.teacherApplicationModel
      .find({ userId })
      .exec();
    return {
      message: 'Kullanıcı başvuruları başarıyla getirildi',
      applications: userApplications,
    };
  }

  async approve(applicationId: string) {
    const application =
      await this.teacherApplicationModel.findById(applicationId);
    if (application) {
      application.status = 'approved';
      await application.save();
      return {
        message: 'Başvuru başarıyla onaylandı',
        application,
      };
    }
    return {
      message: 'Onaylanacak başvuru bulunamadı',
    };
  }

  async updateStatus(id: string, status: string) {
    const application = await this.teacherApplicationModel.findById(id);

    if (!application) {
      throw new NotFoundException(`ID: ${id} olan başvuru bulunamadı`);
    }

    application.status = status;
    await application.save();
    return {
      message: 'Başvuru durumu başarıyla güncellendi',
      application,
    };
  }
}
