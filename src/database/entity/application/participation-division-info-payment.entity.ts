import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { DivisionEntity } from '../competition/division.entity';
import { IParticipationDivisionInfoPayment } from 'src/modules/applications/domain/interface/participation-division-info-payment.interface';
import { PriceSnapshotEntity } from '../competition/price-snapshot.entity';
import { IParticipationDivisionInfo } from 'src/modules/applications/domain/interface/participation-division-info.interface';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { uuidv7 } from 'uuidv7';

/**
 * ParticipationDivisionInfoPayment Entity
 * @namespace Application
 */
@Entity('participation_division_info_payment')
export class ParticipationDivisionInfoPaymentEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IParticipationDivisionInfoPayment['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfoPayment['createdAt'];

  @Column('uuid')
  divisionId!: DivisionEntity['id'];

  @ManyToOne(() => DivisionEntity, (division) => division.priceSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division!: DivisionEntity;

  @Column('uuid')
  priceSnapshotId!: IParticipationDivisionInfoPayment['priceSnapshotId'];

  @ManyToOne(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.participationDivisionInfoPayments)
  @JoinColumn({ name: 'priceSnapshotId' })
  priceSnapshot!: PriceSnapshotEntity;

  @Column('uuid')
  participationDivisionInfoId!: IParticipationDivisionInfo['id'];

  @OneToOne(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoPayment,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'participationDivisionInfoId' })
  participationDivisionInfo!: ParticipationDivisionInfoEntity;
}
