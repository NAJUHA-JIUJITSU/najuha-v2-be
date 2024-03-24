import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Competition } from './competition.entity';

type unit = {
  uniform: 'GI' | 'NOGI';
  weight: 'WEIGHT' | 'ABSOLUTE';
};

type discountRule = {
  combination: unit[];
  discountAmount: number;
};

@Entity('combination_discount_snapshot')
export class CombinationDiscountSnapshot {
  /**
   * - combination discount snapshot id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  discountRules: discountRule[];

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  @CreateDateColumn()
  createdAt: Date | string;

  @Column()
  competitionId: Competition['id'];

  @ManyToOne(() => Competition, (competition) => competition.combinationDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition?: Competition;
}
