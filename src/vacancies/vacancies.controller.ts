import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Patch,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { SortByOption } from '../../types/vacancies';
import { Vacancy } from './vacancy.entity';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PositiveNumberValidationPipe } from '../pipes/positive-number-validation.pipe';

@Controller('vacancies')
@ApiTags('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  @ApiQuery({
    name: 'sortBy',
    enum: ['createdAt', 'title', 'createdBy', 'skills'],
    required: false,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getVacancies(
    @Query('sortBy', new DefaultValuePipe('createdAt')) sortBy: SortByOption,
    @Query('page', new DefaultValuePipe(1), new PositiveNumberValidationPipe())
    page: number,
    @Query(
      'limit',
      new DefaultValuePipe(10),
      new PositiveNumberValidationPipe(),
    )
    limit: number,
  ): Promise<Vacancy[]> {
    try {
      return this.vacanciesService.getVacancies(sortBy, page, limit);
    } catch (error) {
      throw new NotFoundException('Vacancies not found', error.message);
    }
  }

  @ApiOperation({ summary: 'Create a new vacancy' })
  @Post()
  createVacancy(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.createVacancy(createVacancyDto);
  }

  @Patch(':id')
  updateVacancy(
    @Param('id') id: number,
    @Body() updateVacancyDto: UpdateVacancyDto,
  ) {
    return this.vacanciesService.updateVacancy(id, updateVacancyDto);
  }

  @Delete(':id')
  deleteVacancy(@Param('id') id: number) {
    return this.vacanciesService.deleteVacancy(id);
  }
}
