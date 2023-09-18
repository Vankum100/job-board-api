import { IsNotEmpty, IsArray, Length } from 'class-validator';

export class CreateVacancyDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Length(1, 300)
  description: string;

  @IsNotEmpty()
  @IsArray()
  skills: string[];

  @IsNotEmpty()
  createdBy: string;
}
