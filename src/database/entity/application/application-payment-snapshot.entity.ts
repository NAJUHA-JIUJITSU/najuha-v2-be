import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { IApplicationPaymentSnapshot } from '../../../modules/applications/domain/interface/application-payment-sanpshot.interface';
import { ApplicationPaymentEntity } from './application-payment.entity';
import { ParticipationDivisionInfoPaymentMapEntity } from './participation-division-info-payment-map.entity';

/**
 * Application Payment Snapshot Entity
 * @namespace Application
 */
@Entity('application_payment_snapshot')
export class ApplicationPaymentSnapshotEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IApplicationPaymentSnapshot['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IApplicationPaymentSnapshot['createdAt'];

  @Column('int', { unsigned: true })
  normalAmount!: IApplicationPaymentSnapshot['normalAmount'];

  @Column('int', { unsigned: true })
  earlybirdDiscountAmount!: IApplicationPaymentSnapshot['earlybirdDiscountAmount'];

  @Column('int', { unsigned: true })
  combinationDiscountAmount!: IApplicationPaymentSnapshot['combinationDiscountAmount'];

  @Column('int', { unsigned: true })
  totalAmount!: IApplicationPaymentSnapshot['totalAmount'];

  @Column('uuid')
  applicationPaymentId!: IApplicationPaymentSnapshot['applicationPaymentId'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------
  @ManyToOne(() => ApplicationPaymentEntity, (applicationPayment) => applicationPayment.applicationPaymentSnapshots)
  @JoinColumn({ name: 'applicationPaymentId' })
  applicationPayment!: ApplicationPaymentEntity;

  @OneToMany(() => ParticipationDivisionInfoPaymentMapEntity, (map) => map.applicationPaymentSnapshot)
  participationDivisionInfoPaymentMaps!: ParticipationDivisionInfoPaymentMapEntity[];
}
