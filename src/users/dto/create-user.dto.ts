import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;
}
