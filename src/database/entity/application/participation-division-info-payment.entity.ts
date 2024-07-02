import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { IParticipationDivisionInfoPayment } from '../../../modules/applications/domain/interface/participation-division-info-payment.interface';
import { ApplicationOrderPaymentSnapshotEntity } from './application-order-payment-snapshot.entity';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { DivisionEntity } from '../competition/division.entity';
import { PriceSnapshotEntity } from '../competition/price-snapshot.entity';

/**
 * ParticipationDivisionInfoPaymentEntity
 * @namespace Application
 */
@Entity('participation_division_info_payment')
export class ParticipationDivisionInfoPaymentEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IParticipationDivisionInfoPayment['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfoPayment['createdAt'];

  @Column('uuid')
  applicationOrderPaymentSnapshotId!: IParticipationDivisionInfoPayment['applicationOrderPaymentSnapshotId'];

  @Column('uuid')
  participationDivisionInfoId!: IParticipationDivisionInfoPayment['participationDivisionInfoId'];

  @Column('uuid')
  divisionId!: IParticipationDivisionInfoPayment['divisionId'];

  @Column('uuid')
  priceSnapshotId!: IParticipationDivisionInfoPayment['priceSnapshotId'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------
  @ManyToOne(
    () => ApplicationOrderPaymentSnapshotEntity,
    (applicationOrderPaymentSnapshot) => applicationOrderPaymentSnapshot.participationDivisionInfoPayments,
  )
  @JoinColumn({ name: 'applicationOrderPaymentSnapshotId' })
  applicationOrderPaymentSnapshot!: ApplicationOrderPaymentSnapshotEntity;

  @ManyToOne(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoPayments,
  )
  @JoinColumn({ name: 'participationDivisionInfoId' })
  participationDivisionInfo!: ParticipationDivisionInfoEntity;

  @ManyToOne(() => DivisionEntity, (division) => division.participationDivisionInfoPayments)
  @JoinColumn({ name: 'divisionId' })
  division!: DivisionEntity;

  @ManyToOne(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.participationDivisionInfoPayments)
  @JoinColumn({ name: 'priceSnapshotId' })
  priceSnapshot!: PriceSnapshotEntity;
}
