import { Controller, Param, Post, Get, Put, Body } from '@nestjs/common';

// Services
import { ApplicationService } from './application.service';

@Controller('application')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Post('apply')
  apply() {
    return this.applicationService.apply();
  }

  @Get('getAll')
  getAll() {
    return this.applicationService.getAll();
  }

  @Get('getByUserId')
  getByUserId() {
    return this.applicationService.getByUserId();
  }

  @Put('approve')
  approve() {
    return this.applicationService.approve();
  }

  @Put('status/:id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.applicationService.updateStatus(id, status);
  }
}
