import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ParticipationDivisionInfoSnapshotEntity } from './participation-division-info-snapshot.entity';
import { ApplicationEntity } from './application.entity';
import { IParticipationDivisionInfo } from 'src/modules/applications/domain/interface/participation-division-info.interface';
import { ParticipationDivisionInfoPaymentEntity } from './participation-division-info-payment.entity';
import { IApplication } from 'src/modules/applications/domain/interface/application.interface';

@Entity('participation_division_info')
export class ParticipationDivisionInfoEntity {
  @Column('varchar', { length: 26, primary: true })
  id: IParticipationDivisionInfo['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: IParticipationDivisionInfo['createdAt'];

  @Column()
  applicationId: IApplication['id'];

  @ManyToOne(() => ApplicationEntity, (application) => application.participationDivisionInfos)
  @JoinColumn({ name: 'applicationId' })
  application: ApplicationEntity;

  @OneToMany(
    () => ParticipationDivisionInfoSnapshotEntity,
    (participationDivisionInfoSnapshot) => participationDivisionInfoSnapshot.participationDivisionInfo,
    { cascade: true },
  )
  participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotEntity[];

  @OneToOne(
    () => ParticipationDivisionInfoPaymentEntity,
    (participationDivisionInfoPayment) => participationDivisionInfoPayment.participationDivisionInfo,
  )
  participationDivisionInfoPayment: ParticipationDivisionInfoPaymentEntity;
}
