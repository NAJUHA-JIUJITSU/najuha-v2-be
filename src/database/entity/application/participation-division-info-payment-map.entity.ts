import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { IParticipationDivisionInfoPaymentMap } from '../../../modules/applications/domain/interface/participation-division-info-payment-map.interface';
import { ApplicationPaymentSnapshotEntity } from './application-payment-snapshot.entity';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';

/**
 * ParticipationDivisionInfoPaymentMap Entity
 * @namespace Application
 */
@Entity('participation_division_info_payment_map')
export class ParticipationDivisionInfoPaymentMapEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IParticipationDivisionInfoPaymentMap['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfoPaymentMap['createdAt'];

  @Column('uuid')
  applicationPaymentSnapshotId!: IParticipationDivisionInfoPaymentMap['applicationPaymentSnapshotId'];

  @Column('uuid')
  participationDivisionInfoId!: IParticipationDivisionInfoPaymentMap['participationDivisionInfoId'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------

  @ManyToOne(
    () => ApplicationPaymentSnapshotEntity,
    (applicationPaymentSnapshot) => applicationPaymentSnapshot.participationDivisionInfoPaymentMaps,
  )
  @JoinColumn({ name: 'applicationPaymentSnapshotId' })
  applicationPaymentSnapshot!: ApplicationPaymentSnapshotEntity;

  @ManyToOne(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoPaymentMaps,
  )
  @JoinColumn({ name: 'participationDivisionInfoId' })
  participationDivisionInfo!: ParticipationDivisionInfoEntity;
}
