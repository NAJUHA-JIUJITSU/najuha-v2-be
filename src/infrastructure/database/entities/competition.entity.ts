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

  @Column('varchar', { length: 256, default: 'DEFAULT TITLE' })
  title: string;

  @Column('varchar', { length: 256, default: 'DEFAULT ADDRESS' })
  address: string;

  @Column('date', { nullable: true })
  competitionDate: null | Date | string;

  @Column('date', { nullable: true })
  registrationStartDate: null | Date | string;

  @Column('date', { nullable: true })
  registrationEndDate: null | Date | string;

  @Column('date', { nullable: true })
  refundDeadlineDate: null | Date | string;

  @Column('date', { nullable: true })
  soloRegistrationAdjustmentStartDate: null | Date | string;

  @Column('date', { nullable: true })
  soloRegistrationAdjustmentEndDate: null | Date | string;

  @Column('date', { nullable: true })
  registrationListOpenDate: null | Date | string;

  @Column('date', { nullable: true })
  bracketOpenDate: null | Date | string;

  @Column('text', { default: 'DEFAULT DESCRIPTION' })
  description: string;

  @Column('boolean', { default: false })
  isPartnership: boolean;

  @Column('int', { default: 0 })
  viewCount: number;

  @Column('varchar', { length: 256, nullable: true })
  posterImgUrlKey: null | string;

  @Column('varchar', { length: 16, default: 'INACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;

  @OneToOne(() => EarlyBirdDiscountStrategyEntity, (earlyBirdDiscountStrategy) => earlyBirdDiscountStrategy.competition)
  @JoinColumn()
  earlyBirdDiscountStrategy?: EarlyBirdDiscountStrategyEntity;
}
