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

  async getAll(): Promise<{
    message: string;
    applications: TeacherApplication[];
  }> {
    try {
      const applications = await this.teacherApplicationModel
        .find()
        .sort({ createdAt: -1 }) // En yeni başvurular önce gelsin
        .exec();

      return {
        message: 'Tüm başvurular başarıyla getirildi',
        applications,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Başvurular getirilirken bir hata oluştu');
    }
  }

  async getByUserId(
    userId: string,
  ): Promise<{ message: string; applications: TeacherApplication[] }> {
    try {
      const userApplications = await this.teacherApplicationModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .exec();

      if (!userApplications.length) {
        return {
          message: 'Bu kullanıcıya ait başvuru bulunamadı',
          applications: [],
        };
      }

      return {
        message: 'Kullanıcı başvuruları başarıyla getirildi',
        applications: userApplications,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Kullanıcı başvuruları getirilirken bir hata oluştu');
    }
  }

  async approve(
    applicationId: string,
  ): Promise<{ message: string; application?: TeacherApplication }> {
    try {
      const application =
        await this.teacherApplicationModel.findById(applicationId);

      if (!application) {
        return {
          message: 'Onaylanacak başvuru bulunamadı',
        };
      }

      application.status = 'Başvurunuz Onaylandı';
      application.isApproved = true;
      application.updatedAt = new Date();

      await application.save();

      return {
        message: 'Başvuru başarıyla onaylandı',
        application,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Başvuru onaylanırken bir hata oluştu');
    }
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<{ message: string; application: TeacherApplication }> {
    try {
      const application = await this.teacherApplicationModel.findById(id);

      if (!application) {
        throw new NotFoundException(`ID: ${id} olan başvuru bulunamadı`);
      }

      application.status = status;
      application.updatedAt = new Date();
      await application.save();

      return {
        message: 'Başvuru durumu başarıyla güncellendi',
        application,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Başvuru durumu güncellenirken bir hata oluştu');
    }
  }
}
