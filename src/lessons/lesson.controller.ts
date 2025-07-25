import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonDto } from './dto/lesson.dto';
import { RolesGuard } from './guards/auth.guard';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async create(
    @Request() req: RequestWithUser,
    @Body() createLessonDto: LessonDto,
  ) {
    if (!req.user || !req.user.roles.includes('teacher')) {
      throw new UnauthorizedException('Bu işlem için öğretmen rolü gereklidir');
    }
    const lesson = await this.lessonService.create(
      createLessonDto,
      req.user._id,
    );
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateLessonDto: LessonDto,
  ) {
    // Dersin sahibi olup olmadığını kontrol et
    const lesson = await this.lessonService.findOne(id);
    if (lesson.teacherId.toString() !== req.user._id.toString()) {
      throw new UnauthorizedException('Bu dersi düzenleme yetkiniz yok');
    }

    const updatedLesson = await this.lessonService.update(id, updateLessonDto);
    return {
      message: 'Ders başarıyla güncellendi',
      lesson: updatedLesson,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  async remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    try {
      // Dersin var olup olmadığını kontrol et
      const lesson = await this.lessonService.findOne(id);
      if (!lesson) {
        throw new UnauthorizedException('Ders bulunamadı');
      }

      // Dersin teacherId alanının varlığını kontrol et
      if (!lesson.teacherId) {
        throw new UnauthorizedException('Ders sahibi bilgisi bulunamadı');
      }

      // Dersin sahibi olup olmadığını kontrol et
      if (lesson.teacherId.toString() !== req.user._id.toString()) {
        throw new UnauthorizedException('Bu dersi silme yetkiniz yok');
      }

      await this.lessonService.remove(id);
      return {
        message: 'Ders başarıyla silindi',
      };
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Ders silinirken bir hata oluştu');
    }
  }
}
