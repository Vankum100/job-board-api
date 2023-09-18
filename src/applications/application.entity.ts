import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['userId', 'vacancyId'], { unique: true })
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  vacancyId: number;

  @Column({ default: false })
  viewed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
