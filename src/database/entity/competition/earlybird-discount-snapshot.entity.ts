import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, PrimaryColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { IEarlybirdDiscountSnapshot } from '../../../modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { uuidv7 } from 'uuidv7';
import { ApplicationOrderEntity } from '../application/application-order.entity';

/**
 * EarlybirdDiscountSnapshot.
 *
 * 얼리버드 할인 스냅샷.
 * - 얼리버드 할인 규칙이 변경될때마다 스냅샷을 생성한다.
 * @namespace Competition
 */
@Entity('earlybird_discount_snapshot')
@Index('IDX_EarlybirdDiscountSnapshot_competitionId', ['competitionId'])
export class EarlybirdDiscountSnapshotEntity {
  /**  UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IEarlybirdDiscountSnapshot['id'];

  /** 얼리버드 할인 시작일. */
  @Column('timestamptz')
  earlybirdStartDate!: IEarlybirdDiscountSnapshot['earlybirdStartDate'];

  /** 얼리버드 할인 마감일. */
  @Column('timestamptz')
  earlybirdEndDate!: IEarlybirdDiscountSnapshot['earlybirdEndDate'];

  /**
   * 얼리버드 할인 가격.
   * - ex) 10000.
   * - 단위 : 원.
   * - 음수 값은 허용하지 않습니다.
   */
  @Column('int')
  discountAmount!: IEarlybirdDiscountSnapshot['discountAmount'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IEarlybirdDiscountSnapshot['createdAt'];

  @Column('uuid')
  competitionId!: CompetitionEntity['id'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------
  @ManyToOne(() => CompetitionEntity, (competition) => competition.earlybirdDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;

  @OneToMany(() => ApplicationOrderEntity, (applicationOrder) => applicationOrder.earlybirdDiscountSnapshot)
  applicationOrders!: ApplicationOrderEntity[];
}
