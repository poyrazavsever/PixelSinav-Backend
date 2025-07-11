import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DifficultyLevel, LessonStatus } from '../dto/lesson.dto';

// Ders Bölümü Alt Şeması
@Schema({ _id: false })
export class LessonSection {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  sectionId: Types.ObjectId;

  @Prop({ required: true, minlength: 3, maxlength: 100 })
  title: string;

  @Prop({ required: true, minlength: 10 })
  content: string; // Markdown içerik

  @Prop({ required: true, minlength: 10, maxlength: 1000 })
  description: string;

  @Prop({ required: true, min: 1 })
  order: number;

  @Prop({ required: true, min: 0, max: 5000 })
  xpPoints: number;
}

export const LessonSectionSchema = SchemaFactory.createForClass(LessonSection);

// Ana Ders Şeması
@Schema({ timestamps: true })
export class Lesson extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, minlength: 3, maxlength: 100 })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: DifficultyLevel })
  difficultyLevel: DifficultyLevel;

  @Prop({
    required: true,
    type: [String],
    validate: [
      (val: string[]) => val.length > 0,
      'En az bir etiket gereklidir',
    ],
  })
  tags: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, minlength: 10, maxlength: 2000 })
  description: string;

  @Prop({
    required: true,
    enum: LessonStatus,
    default: LessonStatus.DRAFT,
  })
  status: LessonStatus;

  @Prop({
    required: true,
    type: [LessonSectionSchema],
    validate: [
      (val: LessonSection[]) => val.length > 0,
      'En az bir bölüm gereklidir',
    ],
  })
  sections: LessonSection[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;

  // Ek özellikler
  @Prop({ default: 0 })
  totalXP: number; // Tüm bölümlerin toplam XP'si

  @Prop({ default: 0 })
  enrollmentCount: number; // Derse kayıt olan öğrenci sayısı

  @Prop({ type: Types.ObjectId, required: true })
  teacherId: Types.ObjectId; // Dersi oluşturan öğretmen
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

// Pre-save hook to calculate totalXP
LessonSchema.pre('save', function (next) {
  if (this.sections && this.sections.length > 0) {
    this.totalXP = this.sections.reduce(
      (sum, section) => sum + section.xpPoints,
      0,
    );
  }
  next();
});
