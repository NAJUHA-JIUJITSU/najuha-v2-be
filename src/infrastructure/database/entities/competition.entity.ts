import { ICompetition } from 'src/interfaces/competition.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('competition')
export class CompetitionEntity implements ICompetition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('varchar', { length: 255 })
  address: string;

  @Column('date')
  competitionDate: Date;

  @Column('date')
  registrationStartDate: Date;

  @Column('date')
  registrationEndDate: Date;

  @Column('date')
  refundDeadlineDate: Date;

  @Column('date')
  soloRegistrationAdjustmentStartDate: Date;

  @Column('date')
  soloRegistrationAdjustmentEndDate: Date;

  @Column('date')
  registrationListOpenDate: Date;

  @Column('date')
  bracketOpenDate: Date;

  @Column('text')
  description: string;

  @Column('varchar', { length: 10, default: 'INACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
