import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lesson } from './schemas/lesson.schema';
import { LessonDto } from './dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(@InjectModel(Lesson.name) private lessonModel: Model<Lesson>) {}

  async create(createLessonDto: LessonDto, teacherId: string): Promise<Lesson> {
    const lesson = new this.lessonModel({
      ...createLessonDto,
      teacherId: new Types.ObjectId(teacherId),
    });
    return await lesson.save();
  }

  async findAll(): Promise<Lesson[]> {
    return await this.lessonModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Lesson> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Geçersiz ders ID');
    }
    const lesson = await this.lessonModel.findById(id).exec();
    if (!lesson) {
      throw new NotFoundException('Ders bulunamadı');
    }
    return lesson;
  }

  async findByTeacher(teacherId: string): Promise<Lesson[]> {
    return await this.lessonModel
      .find({ teacherId: new Types.ObjectId(teacherId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateLessonDto: Partial<LessonDto>,
  ): Promise<Lesson> {
    const lesson = await this.lessonModel
      .findByIdAndUpdate(id, updateLessonDto, { new: true })
      .exec();

    if (!lesson) {
      throw new NotFoundException('Ders bulunamadı');
    }
    return lesson;
  }

  async remove(id: string): Promise<void> {
    const result = await this.lessonModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Ders bulunamadı');
    }
  }
}
