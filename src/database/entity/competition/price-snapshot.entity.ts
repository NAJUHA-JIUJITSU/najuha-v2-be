import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DivisionEntity } from './division.entity';
import { ParticipationDivisionInfoPaymentEntity } from '../application/participation-division-info-payment.entity';
import { uuidv7 } from 'uuidv7';
import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';

/**
 * PriceSnapshot Entity
 * @namespace Competition
 */
@Entity('price_snapshot')
// @Index('divisionId_idx', ['divisionId'])
export class PriceSnapshotEntity {
  @Column('varchar', { length: 36, primary: true, default: uuidv7() })
  id!: IPriceSnapshot['id'];

  @Column('int')
  price!: IPriceSnapshot['price'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPriceSnapshot['createdAt'];

  @Column()
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
