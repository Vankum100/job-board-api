import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @IsBoolean()
  viewed: boolean;
}
