import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonDto } from './dto/lesson.dto';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  async create(@Body() createLessonDto: LessonDto) {
    // Test için sabit bir teacherId kullanıyoruz
    const teacherId = '64a8a7b2e8b8f0c9d8e6f4a2';
    const lesson = await this.lessonService.create(createLessonDto, teacherId);
    return {
      message: 'Ders başarıyla oluşturuldu',
      lesson,
    };
  }

  @Get()
  async findAll() {
    const lessons = await this.lessonService.findAll();
    return {
      message: 'Dersler başarıyla getirildi',
      lessons,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const lesson = await this.lessonService.findOne(id);
    return {
      message: 'Ders başarıyla getirildi',
      lesson,
    };
  }

  @Get('teacher/:teacherId')
  async findByTeacher(@Param('teacherId') teacherId: string) {
    const lessons = await this.lessonService.findByTeacher(teacherId);
    return {
      message: 'Öğretmenin dersleri başarıyla getirildi',
      lessons,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLessonDto: LessonDto) {
    const lesson = await this.lessonService.update(id, updateLessonDto);
    return {
      message: 'Ders başarıyla güncellendi',
      lesson,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.lessonService.remove(id);
    return {
      message: 'Ders başarıyla silindi',
    };
  }
}
