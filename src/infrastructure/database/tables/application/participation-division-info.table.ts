import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ParticipationDivisionInfoSnapshotTable } from './participation-division-info-snapshot.table';
import { ApplicationTable } from './application.table';
import { IParticipationDivisionInfo } from 'src/modules/applications/domain/interface/participation-division-info.interface';
import { ParticipationDivisionInfoPaymentTable } from './participation-division-info-payment.table';
import { IApplication } from 'src/modules/applications/domain/interface/application.interface';

@Entity('participation_division_info')
export class ParticipationDivisionInfoTable {
  @Column('varchar', { length: 26, primary: true })
  id: IParticipationDivisionInfo['id'];

  @CreateDateColumn()
  createdAt: IParticipationDivisionInfo['createdAt'];

  @Column()
  applicationId: IApplication['id'];

  @ManyToOne(() => ApplicationTable, (application) => application.participationDivisionInfos)
  @JoinColumn({ name: 'applicationId' })
  application: ApplicationTable;

  @OneToMany(
    () => ParticipationDivisionInfoSnapshotTable,
    (participationDivisionInfoSnapshot) => participationDivisionInfoSnapshot.participationDivisionInfo,
    { cascade: true },
  )
  participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotTable[];

  @OneToOne(
    () => ParticipationDivisionInfoPaymentTable,
    (participationDivisionInfoPayment) => participationDivisionInfoPayment.participationDivisionInfo,
  )
  participationDivisionInfoPayment: ParticipationDivisionInfoPaymentTable;
}
