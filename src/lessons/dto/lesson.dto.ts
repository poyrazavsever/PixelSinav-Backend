import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// Zorluk seviyesi için enum
export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

// Ders durumu için enum
export enum LessonStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

// Ders bölümleri için DTO
export class LessonSectionDto {
  @IsOptional()
  @IsString({ message: 'Bölüm ID string olmalıdır' })
  sectionId?: string;

  @IsNotEmpty({ message: 'Bölüm başlığı boş olamaz' })
  @IsString({ message: 'Bölüm başlığı string olmalıdır' })
  @MinLength(3, { message: 'Bölüm başlığı en az 3 karakter olmalıdır' })
  @MaxLength(100, { message: 'Bölüm başlığı en fazla 100 karakter olmalıdır' })
  title: string;

  @IsNotEmpty({ message: 'Bölüm içeriği boş olamaz' })
  @IsString({ message: 'Bölüm içeriği string olmalıdır' })
  @MinLength(10, { message: 'Bölüm içeriği en az 10 karakter olmalıdır' })
  content: string;

  @IsNotEmpty({ message: 'Bölüm açıklaması boş olamaz' })
  @IsString({ message: 'Bölüm açıklaması string olmalıdır' })
  @MinLength(10, { message: 'Bölüm açıklaması en az 10 karakter olmalıdır' })
  @MaxLength(1000, {
    message: 'Bölüm açıklaması en fazla 1000 karakter olmalıdır',
  })
  description: string;

  @IsNotEmpty({ message: 'Bölüm sırası boş olamaz' })
  @IsNumber({}, { message: 'Bölüm sırası number olmalıdır' })
  @Min(1, { message: 'Bölüm sırası en az 1 olmalıdır' })
  order: number;

  @IsNotEmpty({ message: 'Bölüm XP değeri boş olamaz' })
  @IsNumber({}, { message: 'Bölüm XP değeri number olmalıdır' })
  @Min(0, { message: 'Bölüm XP değeri negatif olamaz' })
  @Max(5000, { message: 'Bölüm XP değeri en fazla 5000 olabilir' })
  xpPoints: number;
}

// Ana ders DTO'su
export class LessonDto {
  @IsNotEmpty({ message: 'Kullanıcı ID boş olamaz' })
  @IsString({ message: 'Kullanıcı ID string olmalıdır' })
  userId: string;

  @IsNotEmpty({ message: 'Ders adı boş olamaz' })
  @IsString({ message: 'Ders adı string olmalıdır' })
  @MinLength(3, { message: 'Ders adı en az 3 karakter olmalıdır' })
  @MaxLength(100, { message: 'Ders adı en fazla 100 karakter olmalıdır' })
  title: string;

  @IsNotEmpty({ message: 'Kategori boş olamaz' })
  @IsString({ message: 'Kategori string olmalıdır' })
  category: string;

  @IsNotEmpty({ message: 'Zorluk seviyesi boş olamaz' })
  @IsEnum(DifficultyLevel, { message: 'Geçersiz zorluk seviyesi' })
  difficultyLevel: DifficultyLevel;

  @IsArray({ message: 'Etiketler bir dizi olmalıdır' })
  @IsString({ each: true, message: 'Her etiket string olmalıdır' })
  @ArrayMinSize(1, { message: 'En az bir etiket eklenmelidir' })
  tags: string[];

  @IsNotEmpty({ message: 'Ders görseli boş olamaz' })
  @IsString({ message: 'Ders görseli string olmalıdır' })
  image: string;

  @IsNotEmpty({ message: 'Ders açıklaması boş olamaz' })
  @IsString({ message: 'Ders açıklaması string olmalıdır' })
  @MinLength(10, { message: 'Ders açıklaması en az 10 karakter olmalıdır' })
  @MaxLength(2000, {
    message: 'Ders açıklaması en fazla 2000 karakter olmalıdır',
  })
  description: string;

  @IsOptional()
  @IsEnum(LessonStatus, { message: 'Geçersiz ders durumu' })
  status?: LessonStatus = LessonStatus.DRAFT;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsArray({ message: 'Ders bölümleri bir dizi olmalıdır' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'En az bir ders bölümü eklenmelidir' })
  @Type(() => LessonSectionDto)
  sections: LessonSectionDto[];
}
