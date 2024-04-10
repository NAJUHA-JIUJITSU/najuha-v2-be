import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DivisionEntity } from '../competition/division.entity';
import { IParticipationDivisionPayment } from 'src/modules/applications/domain/interface/participatioin-division-payment.interface';
import { PriceSnapshotEntity } from '../competition/price-snapshot.entity';
import { IParticipationDivision } from 'src/modules/applications/domain/interface/participation-division.interface';
import { ParticipationDivisionEntity } from './participation-divsion.entity';

@Entity('participation_division_payment')
export class ParticipationDivisionPaymentEntity {
  @Column('varchar', { length: 26, primary: true })
  id: IParticipationDivisionPayment['id'];

  @CreateDateColumn()
  createdAt: IParticipationDivisionPayment['createdAt'];

  @Column()
  divisionId: DivisionEntity['id'];

  @ManyToOne(() => DivisionEntity, (division) => division.priceSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division: DivisionEntity;

  @Column()
  priceSnapshotId: IParticipationDivisionPayment['priceSnapshotId'];

  @ManyToOne(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.participationDivisionPayments)
  @JoinColumn({ name: 'priceSnapshotId' })
  priceSnapshot: PriceSnapshotEntity;

  @Column()
  participationDivisionId: IParticipationDivision['id'];

  @OneToOne(
    () => ParticipationDivisionEntity,
    (participationDivision) => participationDivision.participationDivisionPayment,
  )
  @JoinColumn({ name: 'participationDivisionId' })
  participationDivision: ParticipationDivisionEntity;
}
