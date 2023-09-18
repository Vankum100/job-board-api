import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Vacancy } from './vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { SortByOption } from '../../types/vacancies';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepository: Repository<Vacancy>,
    private connection: Connection,
  ) {}

  async getVacancies(
    sortBy: SortByOption,
    page: number,
    limit: number,
  ): Promise<Vacancy[]> {
    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      throw new NotFoundException('Invalid page or limit');
    }
    const queryBuilder: SelectQueryBuilder<Vacancy> =
      this.vacancyRepository.createQueryBuilder('vacancy');

    const sortingCriteria = `vacancy.${sortBy}`;

    queryBuilder.orderBy(sortingCriteria, 'ASC');
    const offset = (page - 1) * limit;

    queryBuilder.skip(offset).take(limit);

    return queryBuilder.getMany();
  }

  async createVacancy(createVacancyDto: CreateVacancyDto) {
    const vacancy = this.vacancyRepository.create(createVacancyDto);
    return this.vacancyRepository.save(vacancy);
  }

  async updateVacancy(id: number, updateVacancyDto: UpdateVacancyDto) {
    return this.transaction(async (queryRunner) => {
      const vacancy = await queryRunner.manager.findOneBy(Vacancy, { id });

      if (!vacancy) {
        throw new NotFoundException('Vacancy not found');
      }

      queryRunner.manager.merge(Vacancy, vacancy as Vacancy, updateVacancyDto);
      await queryRunner.manager.save(Vacancy, vacancy);
      return vacancy;
    });
  }

  async deleteVacancy(id: number) {
    return this.transaction(async (queryRunner) => {
      const vacancy = await queryRunner.manager.findOneBy(Vacancy, { id });

      if (!vacancy) {
        throw new NotFoundException('Vacancy not found');
      }

      await queryRunner.manager.remove(Vacancy, vacancy);
    });
  }

  private async transaction<T>(
    operation: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
