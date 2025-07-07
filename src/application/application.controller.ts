import { Controller, Param, Post, Get, Put, Body } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationDto } from './dto/application.dto';

@Controller('application')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Post('apply')
  async apply(@Body() applicationDto: ApplicationDto): Promise<any> {
    return this.applicationService.apply(applicationDto);
  }

  @Get('getAll')
  getAll() {
    return this.applicationService.getAll();
  }

  @Get('getByUserId/:userId')
  getByUserId(@Param('userId') userId: string) {
    return this.applicationService.getByUserId(Number(userId));
  }

  @Put('approve/:id')
  approve(@Param('id') applicationId: string) {
    return this.applicationService.approve(applicationId);
  }

  @Put('status/:id')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.applicationService.updateStatus(id, status);
  }
}
