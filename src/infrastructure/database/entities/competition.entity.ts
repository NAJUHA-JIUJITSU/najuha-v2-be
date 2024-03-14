import { ICompetition } from 'src/interfaces/competition.interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EarlyBirdDiscountStrategyEntity } from './early-bird-discount-strategy.entity';

@Entity('competition')
export class CompetitionEntity implements ICompetition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('varchar', { length: 255 })
  address: string;

  @Column('date')
  competitionDate: Date | string;

  @Column('date')
  registrationStartDate: Date | string;

  @Column('date')
  registrationEndDate: Date | string;

  @Column('date')
  refundDeadlineDate: Date | string;

  @Column('date')
  soloRegistrationAdjustmentStartDate: Date | string;

  @Column('date')
  soloRegistrationAdjustmentEndDate: Date | string;

  @Column('date')
  registrationListOpenDate: Date | string;

  @Column('date')
  bracketOpenDate: Date | string;

  @Column('text')
  description: string;

  @Column('varchar', { length: 10, default: 'INACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;

  @OneToOne(() => EarlyBirdDiscountStrategyEntity, (earlyBirdDiscountStrategy) => earlyBirdDiscountStrategy.competition)
  @JoinColumn()
  earlyBirdDiscountStrategy?: EarlyBirdDiscountStrategyEntity;
}
