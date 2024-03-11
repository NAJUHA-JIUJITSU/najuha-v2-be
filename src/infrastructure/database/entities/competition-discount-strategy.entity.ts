import { ICompetitionDiscountStrategy } from 'src/interfaces/competition-discount-strategy.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('competition_discount_strategy')
export class CompetitionDiscountStrategyEntity implements ICompetitionDiscountStrategy {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 얼리버드 할인드
   */

  @CreateDateColumn()
  createdAt: Date | string;

  @UpdateDateColumn()
  updatedAt: Date | string;
}
