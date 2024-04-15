import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DivisionTable } from '../competition/division.table';
import { IParticipationDivisionInfoPayment } from 'src/modules/applications/domain/interface/participation-division-info-payment.interface';
import { PriceSnapshotTable } from '../competition/price-snapshot.entity';
import { IParticipationDivisionInfo } from 'src/modules/applications/domain/interface/participation-division-info.interface';
import { ParticipationDivisionInfoTable } from './participation-division-info.table';

@Entity('participation_division_info_payment')
export class ParticipationDivisionInfoPaymentTable {
  @Column('varchar', { length: 26, primary: true })
  id: IParticipationDivisionInfoPayment['id'];

  @CreateDateColumn()
  createdAt: IParticipationDivisionInfoPayment['createdAt'];

  @Column()
  divisionId: DivisionTable['id'];

  @ManyToOne(() => DivisionTable, (division) => division.priceSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division: DivisionTable;

  @Column()
  priceSnapshotId: IParticipationDivisionInfoPayment['priceSnapshotId'];

  @ManyToOne(() => PriceSnapshotTable, (priceSnapshot) => priceSnapshot.participationDivisionInfoPayments)
  @JoinColumn({ name: 'priceSnapshotId' })
  priceSnapshot: PriceSnapshotTable;

  @Column()
  participationDivisionInfoId: IParticipationDivisionInfo['id'];

  @OneToOne(
    () => ParticipationDivisionInfoTable,
    (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoPayment,
  )
  @JoinColumn({ name: 'participationDivisionInfoId' })
  participationDivisionInfo: ParticipationDivisionInfoTable;
}
