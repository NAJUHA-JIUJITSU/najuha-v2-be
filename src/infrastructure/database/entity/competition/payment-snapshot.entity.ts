import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { IPaymentSnapshot } from 'src/modules/competitions/domain/interface/payment-snapshot.interface';
import { ulid } from 'ulid';

@Entity('payment_snapshot')
export class PaymentSnapshotEntity {
  @Column('varchar', { length: 26, primary: true, default: ulid() })
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

  @Column()
  applicationId!: ApplicationEntity['id'];

  @ManyToOne(() => ApplicationEntity, (application) => application.paymentSnapshots)
  application!: ApplicationEntity;
}
