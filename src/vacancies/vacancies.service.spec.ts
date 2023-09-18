import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { Vacancy } from './vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { Connection, Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

describe('VacanciesService', () => {
  let service: VacanciesService;
  let vacancyRepository: Repository<Vacancy>;
  let connection: Connection;

  beforeEach(async () => {
    const queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOneBy: jest.fn(),
        findOne: jest.fn(),
        merge: jest.fn(),
        remove: jest.fn(),
        save: jest.fn(),
      },
    };

    const mockQueryBuilder = {
      orderBy: jest.fn(),
      skip: jest.fn(),
      take: jest.fn(),
      getMany: jest.fn(),
    };
    const mockVacancy: Vacancy = {
      id: 1,
      title: 'Vacancy 1',
      description: 'Description 1',
      skills: ['Skill 1', 'Skill 2'],
      createdBy: 'User 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    queryRunner.manager.findOneBy.mockResolvedValue(mockVacancy);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        {
          provide: getRepositoryToken(Vacancy),
          useClass: Repository,
        },
        {
          provide: Connection,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(queryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
    vacancyRepository = module.get<Repository<Vacancy>>(
      getRepositoryToken(Vacancy),
    );
    vacancyRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(mockQueryBuilder);
    connection = module.get<Connection>(Connection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getVacancies', () => {
    it('should return an array of vacancies', async () => {
      const mockVacancies: Vacancy[] = [
        {
          id: 1,
          title: 'Vacancy 1',
          description: 'Description 1',
          skills: ['Skill 1', 'Skill 2'],
          createdBy: 'User 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockQueryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn(),
        getMany: jest.fn().mockResolvedValue(mockVacancies),
      };

      vacancyRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(
          mockQueryBuilder as unknown as SelectQueryBuilder<Vacancy>,
        );
      const page = 1;
      const limit = 10;
      await service.getVacancies('createdAt', page, limit);

      expect(vacancyRepository.createQueryBuilder().skip).toHaveBeenCalledWith(
        (page - 1) * limit,
      );
      expect(vacancyRepository.createQueryBuilder().take).toHaveBeenCalledWith(
        limit,
      );
    });

    it('should throw NotFoundException for invalid page or limit', async () => {
      vacancyRepository.find = jest.fn().mockResolvedValue([]);

      await expect(
        service.getVacancies('createdAt', -1, 0),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createVacancy', () => {
    it('should create a new vacancy', async () => {
      const createVacancyDto: CreateVacancyDto = {
        title: 'New Vacancy',
        description: 'Description',
        skills: ['Skill 1', 'Skill 2'],
        createdBy: 'User',
      };

      const newVacancy: Partial<Vacancy> = {
        id: 1,
        ...createVacancyDto,
      };

      vacancyRepository.create = jest.fn().mockReturnValue(newVacancy);
      vacancyRepository.save = jest.fn().mockResolvedValue(newVacancy);

      const result = await service.createVacancy(createVacancyDto);

      expect(result).toEqual(newVacancy);
    });
  });

  describe('updateVacancy', () => {
    it('should update an existing vacancy', async () => {
      const vacancyId = 1;
      const updateVacancyDto: UpdateVacancyDto = {
        title: 'Updated Vacancy',
        description: 'Updated Description',
        skills: [],
      };

      const queryRunnerMock = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOneBy: jest.fn().mockResolvedValue({
            id: vacancyId,
            title: 'Vacancy 1',
            description: 'Description 1',
            skills: ['Skill 1', 'Skill 2'],
            createdBy: 'User 1',
          }), // Mock finding the existing vacancy
          merge: jest.fn(),
          save: jest.fn(),
        },
      };

      connection.createQueryRunner = jest.fn().mockReturnValue(queryRunnerMock);

      await service.updateVacancy(vacancyId, updateVacancyDto);

      expect(queryRunnerMock.connect).toHaveBeenCalled();
      expect(queryRunnerMock.startTransaction).toHaveBeenCalled();

      expect(queryRunnerMock.manager.findOneBy).toHaveBeenCalledWith(Vacancy, {
        id: vacancyId,
      });

      expect(queryRunnerMock.manager.merge).toHaveBeenCalled();

      expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
      expect(queryRunnerMock.rollbackTransaction).not.toHaveBeenCalled();
      expect(queryRunnerMock.release).toHaveBeenCalled();
    });
  });

  describe('deleteVacancy', () => {
    it('should delete an existing vacancy', async () => {
      const vacancyId = 1;

      const queryRunnerMock = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOneBy: jest.fn().mockResolvedValue({ id: vacancyId }),
          remove: jest.fn(),
        },
      };

      connection.createQueryRunner = jest.fn().mockReturnValue(queryRunnerMock);

      await service.deleteVacancy(vacancyId);

      expect(queryRunnerMock.connect).toHaveBeenCalled();
      expect(queryRunnerMock.startTransaction).toHaveBeenCalled();

      expect(queryRunnerMock.manager.remove).toHaveBeenCalledWith(Vacancy, {
        id: vacancyId,
      });

      expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
      expect(queryRunnerMock.rollbackTransaction).not.toHaveBeenCalled();
      expect(queryRunnerMock.release).toHaveBeenCalled();
    });
  });
});
