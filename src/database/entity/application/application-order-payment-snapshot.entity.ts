import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { IApplicationOrderPaymentSnapshot } from '../../../modules/applications/domain/interface/application-order-payment-sanpshot.interface';
import { ApplicationOrderEntity } from './application-order.entity';
import { ParticipationDivisionInfoPaymentEntity } from './participation-division-info-payment.entity';

/**
 * ApplicationOrderPaymentSnapshotEntity
 * @namespace Application
 */
@Entity('application_order_payment_snapshot')
export class ApplicationOrderPaymentSnapshotEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IApplicationOrderPaymentSnapshot['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IApplicationOrderPaymentSnapshot['createdAt'];

  @Column('int', { unsigned: true })
  normalAmount!: IApplicationOrderPaymentSnapshot['normalAmount'];

  @Column('int', { unsigned: true })
  earlybirdDiscountAmount!: IApplicationOrderPaymentSnapshot['earlybirdDiscountAmount'];

  @Column('int', { unsigned: true })
  combinationDiscountAmount!: IApplicationOrderPaymentSnapshot['combinationDiscountAmount'];

  @Column('int', { unsigned: true })
  totalAmount!: IApplicationOrderPaymentSnapshot['totalAmount'];

  @Column('uuid')
  applicationOrderId!: IApplicationOrderPaymentSnapshot['applicationOrderId'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------
  @ManyToOne(() => ApplicationOrderEntity, (applicationOrder) => applicationOrder.applicationOrderPaymentSnapshots)
  @JoinColumn({ name: 'applicationOrderId' })
  applicationOrder!: ApplicationOrderEntity;

  @OneToMany(() => ParticipationDivisionInfoPaymentEntity, (map) => map.applicationOrderPaymentSnapshot, {
    cascade: true,
  })
  participationDivisionInfoPayments!: ParticipationDivisionInfoPaymentEntity[];
}
