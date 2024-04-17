import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DivisionEntity } from './division.entity';
import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';
import { ParticipationDivisionInfoPaymentEntity } from '../application/participation-division-info-payment.entity';

@Entity('price_snapshot')
export class PriceSnapshotEntity {
  @Column('varchar', { length: 26, primary: true })
  id: IPriceSnapshot['id'];

  @Column('int')
  price: IPriceSnapshot['price'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: IPriceSnapshot['createdAt'];

  @Column()
  divisionId: DivisionEntity['id'];

  @ManyToOne(() => DivisionEntity, (division) => division.priceSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division: DivisionEntity;

  @OneToMany(
    () => ParticipationDivisionInfoPaymentEntity,
    (participationDivisionInfoPayment) => participationDivisionInfoPayment.priceSnapshot,
  )
  participationDivisionInfoPayments: ParticipationDivisionInfoPaymentEntity[];
}
