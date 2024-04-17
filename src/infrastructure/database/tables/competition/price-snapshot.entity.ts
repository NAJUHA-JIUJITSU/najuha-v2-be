import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DivisionTable } from './division.table';
import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';
import { ParticipationDivisionInfoPaymentTable } from '../application/participation-division-info-payment.table';

@Entity('price_snapshot')
export class PriceSnapshotTable {
  @Column('varchar', { length: 26, primary: true })
  id: IPriceSnapshot['id'];

  @Column('int')
  price: IPriceSnapshot['price'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: IPriceSnapshot['createdAt'];

  @Column()
  divisionId: DivisionTable['id'];

  @ManyToOne(() => DivisionTable, (division) => division.priceSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division: DivisionTable;

  @OneToMany(
    () => ParticipationDivisionInfoPaymentTable,
    (participationDivisionInfoPayment) => participationDivisionInfoPayment.priceSnapshot,
  )
  participationDivisionInfoPayments: ParticipationDivisionInfoPaymentTable[];
}
