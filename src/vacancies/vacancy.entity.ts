import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Vacancy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ length: 300 })
  description: string;

  @Column('simple-array')
  skills: string[];

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
