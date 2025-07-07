import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { TeacherApplication, UserSchema } from './schemas/application.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeacherApplication.name, schema: UserSchema },
    ]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService],
})
export class ApplicationModule {}
