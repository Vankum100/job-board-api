import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let applicationRepository: Repository<Application>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    applicationRepository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createApplication', () => {
    it('should create an application', async () => {
      const createApplicationDto: CreateApplicationDto = {
        userId: 1,
        vacancyId: 2,
      };
      applicationRepository.findOne = jest.fn().mockResolvedValue(null);

      applicationRepository.create = jest
        .fn()
        .mockReturnValue(createApplicationDto);
      applicationRepository.save = jest
        .fn()
        .mockResolvedValue(createApplicationDto);

      const result = await service.createApplication(createApplicationDto);

      expect(result).toEqual(createApplicationDto);
    });

    it('should throw NotFoundException if an application already exists', async () => {
      const createApplicationDto: CreateApplicationDto = {
        userId: 1,
        vacancyId: 2,
      };

      applicationRepository.findOne = jest
        .fn()
        .mockResolvedValue(createApplicationDto);

      await expect(
        service.createApplication(createApplicationDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });
  describe('updateApplication', () => {
    it('should update an application and set viewed to true', async () => {
      const applicationId = 1;
      const updateApplicationDto: UpdateApplicationDto = {
        viewed: true,
      };

      applicationRepository.findOneBy = jest.fn().mockResolvedValue({
        id: applicationId,
        userId: 1,
        vacancyId: 2,
        viewed: false,
      });

      applicationRepository.update = jest
        .fn()
        .mockResolvedValue({ affected: 1 });

      const result = await service.updateApplication(
        applicationId,
        updateApplicationDto,
      );

      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if the application does not exist', async () => {
      const applicationId = 1;
      const updateApplicationDto: UpdateApplicationDto = {
        viewed: true,
      };

      applicationRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(
        service.updateApplication(applicationId, updateApplicationDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
