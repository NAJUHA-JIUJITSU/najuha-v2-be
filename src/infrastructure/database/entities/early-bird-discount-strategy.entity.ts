import { ICompetition } from 'src/interfaces/competition.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { IEarlyBirdDiscountStrategy } from 'src/interfaces/early-bird-discount-strategy.interface';

@Entity('early_bird_discount_strategy')
export class EarlyBirdDiscountStrategyEntity implements IEarlyBirdDiscountStrategy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  earlyBirdStartDate: Date | string;

  @Column('date')
  earlyBirdEndDate: Date | string;

  @Column('int')
  discountPrice: number;

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;

  @OneToOne(() => CompetitionEntity, (competition) => competition.earlyBirdDiscountStrategy)
  competition: ICompetition;
}
