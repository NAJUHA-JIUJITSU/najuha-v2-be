import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ParticipationDivisionSnapshotEntity } from './participation-division-snapshot.entity';
import { ApplicationEntity } from './application.entity';
import { IParticipationDivision } from 'src/modules/applications/domain/interface/participation-division.interface';
import { ParticipationDivisionPaymentEntity } from './participation-division-payment.entity';
import { IApplication } from 'src/modules/applications/domain/interface/application.interface';

@Entity('participation_division')
export class ParticipationDivisionEntity {
  @Column('varchar', { length: 26, primary: true })
  id: IParticipationDivision['id'];

  @CreateDateColumn()
  createdAt: IParticipationDivision['createdAt'];

  @Column()
  applicationId: IApplication['id'];

  @ManyToOne(() => ApplicationEntity, (application) => application.participationDivisions)
  @JoinColumn({ name: 'applicationId' })
  application: ApplicationEntity;

  @OneToMany(
    () => ParticipationDivisionSnapshotEntity,
    (participationDivisionSnapshot) => participationDivisionSnapshot.participationDivision,
    { cascade: true },
  )
  participationDivisionSnapshots: ParticipationDivisionSnapshotEntity[];

  @OneToOne(
    () => ParticipationDivisionPaymentEntity,
    (participationDivisionPayment) => participationDivisionPayment.participationDivision,
  )
  participationDivisionPayment: ParticipationDivisionPaymentEntity;
}
