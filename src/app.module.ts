import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { ApplicationsModule } from './applications/applications.module';
import typeOrmConfig from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    VacanciesModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
