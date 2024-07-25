import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { IParticipationDivisionInfoPayment } from '../../../modules/applications/domain/interface/participation-division-info-payment.interface';
import { ApplicationOrderPaymentSnapshotEntity } from './application-order-payment-snapshot.entity';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { DivisionEntity } from '../competition/division.entity';
import { PriceSnapshotEntity } from '../competition/price-snapshot.entity';

/**
 * ParticipationDivisionInfoPayment.
 *
 * ParticipationDivisionInfo 에 대한 결제 정보.
 * @namespace Application
 */
@Entity('participation_division_info_payment')
@Index('IDX_ParticipationDivisionInfoPayment_applicationOrderPaymentSnapshotId', ['applicationOrderPaymentSnapshotId'])
export class ParticipationDivisionInfoPaymentEntity {
  /**
   * UUID v7.
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IParticipationDivisionInfoPayment['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfoPayment['createdAt'];

  /**
   * 결제 상태.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   */
  @Column('varchar', { length: 16 })
  status!: IParticipationDivisionInfoPayment['status'];

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
