import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async getApplications() {
    return await this.applicationRepository.find();
  }

  async createApplication(createApplicationDto: CreateApplicationDto) {
    const existingApplication = await this.applicationRepository.findOne({
      where: {
        userId: createApplicationDto.userId,
        vacancyId: createApplicationDto.vacancyId,
      },
    });

    if (existingApplication) {
      throw new NotFoundException('User has already applied to this job');
    }

    const application = this.applicationRepository.create(createApplicationDto);
    return this.applicationRepository.save(application);
  }
  async updateApplication(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
  ) {
    const application = await this.applicationRepository.findOneBy({ id });

    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return this.applicationRepository.update(id, {
      ...updateApplicationDto,
    });
  }
}
