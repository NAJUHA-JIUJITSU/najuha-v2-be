import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, PrimaryColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ICombinationDiscountSnapshot } from '../../../modules/competitions/domain/interface/combination-discount-snapshot.interface';
import { ICompetition } from '../../../modules/competitions/domain/interface/competition.interface';
import { uuidv7 } from 'uuidv7';
import { ApplicationOrderEntity } from '../application/application-order.entity';

/**
 * CombinationDiscountSnapshot.
 *
 * 부문 조합 할인 스냅샷.
 * - 조합 할인 규칙이 변경될때마다 스냅샷을 생성한다.
 * @namespace Competition
 */
@Entity('combination_discount_snapshot')
@Index('IDX_CombinationDiscountSnapshot_competitionId', ['competitionId'])
export class CombinationDiscountSnapshotEntity {
  /**
   * UUID v7.
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ICombinationDiscountSnapshot['id'];

  /** 조합 할인 규칙. */
  @Column('jsonb')
  combinationDiscountRules!: ICombinationDiscountSnapshot['combinationDiscountRules'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICombinationDiscountSnapshot['createdAt'];

  @Column('uuid')
  competitionId!: ICompetition['id'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------
  @ManyToOne(() => CompetitionEntity, (competition) => competition.combinationDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;

  @OneToMany(() => ApplicationOrderEntity, (applicationOrder) => applicationOrder.combinationDiscountSnapshot)
  applicationOrders!: ApplicationOrderEntity[];
}
