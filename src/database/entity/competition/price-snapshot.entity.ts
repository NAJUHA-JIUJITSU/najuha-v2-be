import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { DivisionEntity } from './division.entity';
import { uuidv7 } from 'uuidv7';
import { IPriceSnapshot } from '../../../modules/competitions/domain/interface/price-snapshot.interface';
import { ParticipationDivisionInfoPaymentEntity } from '../application/participation-division-info-payment.entity';

/**
 * PriceSnapshot.
 *
 * 대회 부문이 가격 스냅샷.
 * - 대회 부문의 가격이 변경될때마다 스냅샷을 생성한다.
 * @namespace Competition
 * @erd Application
 */
@Entity('price_snapshot')
@Index('IDX_PriceSnapshot_divisionId', ['divisionId'])
export class PriceSnapshotEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPriceSnapshot['id'];

  /** price, (원). */
  @Column('int')
  price!: IPriceSnapshot['price'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPriceSnapshot['createdAt'];

  @Column('uuid')
  divisionId!: DivisionEntity['id'];

  @ManyToOne(() => DivisionEntity, (division) => division.priceSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division!: DivisionEntity;

  @OneToMany(
    () => ParticipationDivisionInfoPaymentEntity,
    (participationDivisionInfoPayment) => participationDivisionInfoPayment.priceSnapshot,
  )
  participationDivisionInfoPayments!: ParticipationDivisionInfoPaymentEntity[];
}
