import { IsNotEmpty } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  vacancyId: number;
}
