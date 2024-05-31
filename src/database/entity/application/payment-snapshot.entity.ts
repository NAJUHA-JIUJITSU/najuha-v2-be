import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { IPaymentSnapshot } from 'src/modules/competitions/domain/interface/payment-snapshot.interface';
import { uuidv7 } from 'uuidv7';

/**
 * PaymentSnapshot Entity
 * @namespace Application
 */
@Entity('payment_snapshot')
export class PaymentSnapshotEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IPaymentSnapshot['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IPaymentSnapshot['createdAt'];

  @Column('int', { unsigned: true })
  normalAmount!: IPaymentSnapshot['normalAmount'];

  @Column('int', { unsigned: true })
  earlybirdDiscountAmount!: IPaymentSnapshot['earlybirdDiscountAmount'];

  @Column('int', { unsigned: true })
  combinationDiscountAmount!: IPaymentSnapshot['combinationDiscountAmount'];

  @Column('int', { unsigned: true })
  totalAmount!: IPaymentSnapshot['totalAmount'];

  @Column('uuid')
  applicationId!: ApplicationEntity['id'];

  @ManyToOne(() => ApplicationEntity, (application) => application.paymentSnapshots)
  application!: ApplicationEntity;
}
