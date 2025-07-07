import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService], // Diğer modüllerde kullanılabilmesi için export ediyoruz
})
export class ApplicationModule {}
