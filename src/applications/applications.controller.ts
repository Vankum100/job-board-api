import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  getApplications() {
    return this.applicationsService.getApplications();
  }
  @ApiOperation({ summary: 'apply for a vacancy' })
  @Post()
  createApplication(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.createApplication(createApplicationDto);
  }

  @Patch(':id')
  updateApplication(
    @Param('id') id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.updateApplication(id, updateApplicationDto);
  }
}
