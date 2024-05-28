import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { ParticipationDivisionInfoSnapshotEntity } from './participation-division-info-snapshot.entity';
import { ApplicationEntity } from './application.entity';
import { IParticipationDivisionInfo } from 'src/modules/applications/domain/interface/participation-division-info.interface';
import { ParticipationDivisionInfoPaymentEntity } from './participation-division-info-payment.entity';
import { IApplication } from 'src/modules/applications/domain/interface/application.interface';
import { uuidv7 } from 'uuidv7';

/**
 * ParticipationDivisionInfo Entity
 * @namespace Application
 */
@Entity('participation_division_info')
// @Index('applicationId_idx', ['applicationId'])
export class ParticipationDivisionInfoEntity {
  @Column('varchar', { length: 36, primary: true, default: uuidv7() })
  id!: IParticipationDivisionInfo['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfo['createdAt'];

  @Column()
  applicationId!: IApplication['id'];

  @ManyToOne(() => ApplicationEntity, (application) => application.participationDivisionInfos)
  @JoinColumn({ name: 'applicationId' })
  application!: ApplicationEntity;

  /**
   * @minitems 1
   */
  @OneToMany(
    () => ParticipationDivisionInfoSnapshotEntity,
    (participationDivisionInfoSnapshot) => participationDivisionInfoSnapshot.participationDivisionInfo,
    { cascade: true },
  )
  participationDivisionInfoSnapshots!: ParticipationDivisionInfoSnapshotEntity[];

  @OneToOne(
    () => ParticipationDivisionInfoPaymentEntity,
    (participationDivisionInfoPayment) => participationDivisionInfoPayment.participationDivisionInfo,
  )
  participationDivisionInfoPayment!: ParticipationDivisionInfoPaymentEntity;
}
