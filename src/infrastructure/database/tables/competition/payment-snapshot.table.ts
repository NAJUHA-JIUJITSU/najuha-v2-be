import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { ApplicationTable } from '../application/application.table';
import { IPaymentSnapshot } from 'src/modules/competitions/domain/interface/payment-snapshot.interface';

@Entity('payment_snapshot')
export class PaymentSnapshotTable {
  @Column('varchar', { length: 26, primary: true })
  id: IPaymentSnapshot['id'];

  @CreateDateColumn()
  createdAt: IPaymentSnapshot['createdAt'];

  @Column('int', { unsigned: true })
  normalAmount: IPaymentSnapshot['normalAmount'];

  @Column('int', { unsigned: true })
  earlybirdDiscountAmount: IPaymentSnapshot['earlybirdDiscountAmount'];

  @Column('int', { unsigned: true })
  combinationDiscountAmount: IPaymentSnapshot['combinationDiscountAmount'];

  @Column('int', { unsigned: true })
  totalAmount: IPaymentSnapshot['totalAmount'];

  @Column()
  applicationId: ApplicationTable['id'];

  @ManyToOne(() => ApplicationTable, (application) => application.paymentSnapshots)
  application: ApplicationTable;
}
