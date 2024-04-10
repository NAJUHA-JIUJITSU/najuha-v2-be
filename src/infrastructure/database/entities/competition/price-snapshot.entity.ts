import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DivisionEntity } from './division.entity';
import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';
import { ParticipationDivisionPaymentEntity } from '../application/participation-division-payment.entity';

@Entity('price_snapshot')
export class PriceSnapshotEntity {
  @PrimaryGeneratedColumn()
  id: IPriceSnapshot['id'];

  @Column('int')
  price: IPriceSnapshot['price'];

  @CreateDateColumn()
  createdAt: IPriceSnapshot['createdAt'];

  @Column()
  divisionId: DivisionEntity['id'];

  @ManyToOne(() => DivisionEntity, (division) => division.priceSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division: DivisionEntity;

  @OneToMany(
    () => ParticipationDivisionPaymentEntity,
    (participationDivisionPayment) => participationDivisionPayment.priceSnapshot,
  )
  participationDivisionPayments: ParticipationDivisionPaymentEntity[];
}
