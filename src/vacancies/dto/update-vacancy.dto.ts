import { IsOptional, IsArray, Length } from 'class-validator';

export class UpdateVacancyDto {
  @IsOptional()
  title: string;

  @IsOptional()
  @Length(1, 300)
  description: string;

  @IsOptional()
  @IsArray()
  skills: string[];
}
