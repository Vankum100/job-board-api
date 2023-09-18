import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'job_board',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
  logging: process.env.DB_LOGGING === 'true' || false,
};

export default typeOrmConfig;
