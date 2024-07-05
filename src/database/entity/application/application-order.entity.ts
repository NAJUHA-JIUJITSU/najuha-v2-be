import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { IApplicationOrder } from '../../../modules/applications/domain/interface/application-order.interface';
import { uuidv7 } from 'uuidv7';
import { EarlybirdDiscountSnapshotEntity } from '../competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from '../competition/combination-discount-snapshot.entity';
import { ApplicationOrderPaymentSnapshotEntity } from './application-order-payment-snapshot.entity';

/**
 * ApplicationOrderEntity
 * @namespace Application
 */
@Entity('application_order')
@Index('IDX_ApplicationOrder_applicationId', ['applicationId'])
export class ApplicationOrderEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IApplicationOrder['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IApplicationOrder['createdAt'];

  @Column('varchar', { length: 64 })
  orderId!: IApplicationOrder['orderId'];

  @Column('varchar', { length: 200, nullable: true })
  paymentKey!: IApplicationOrder['paymentKey'] | null;

  @Column('varchar', { length: 256 })
  orderName!: IApplicationOrder['orderName'];

  @Column('varchar', { length: 64 })
  customerName!: IApplicationOrder['customerName'];

  @Column('varchar', { length: 320 })
  customerEmail!: IApplicationOrder['customerEmail'];

  @Column('varchar', { length: 16, default: 'READY' })
  status!: IApplicationOrder['status'];

  @Column('boolean', { default: false })
  isPayed!: IApplicationOrder['isPayed'];

  @Column('uuid')
  applicationId!: IApplicationOrder['applicationId'];

  @Column('uuid', { nullable: true })
  earlybirdDiscountSnapshotId!: IApplicationOrder['earlybirdDiscountSnapshotId'];

  @Column('uuid', { nullable: true })
  combinationDiscountSnapshotId!: IApplicationOrder['combinationDiscountSnapshotId'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------
  @ManyToOne(() => ApplicationEntity, (application) => application.applicationOrders)
  @JoinColumn({ name: 'applicationId' })
  application!: ApplicationEntity;

  @ManyToOne(
    () => EarlybirdDiscountSnapshotEntity,
    (earlybirdDiscountSnapshot) => earlybirdDiscountSnapshot.applicationOrders,
  )
  @JoinColumn({ name: 'earlybirdDiscountSnapshotId' })
  earlybirdDiscountSnapshot!: EarlybirdDiscountSnapshotEntity | null;

  @ManyToOne(
    () => CombinationDiscountSnapshotEntity,
    (combinationDiscountSnapshot) => combinationDiscountSnapshot.applicationOrders,
  )
  @JoinColumn({ name: 'combinationDiscountSnapshotId' })
  combinationDiscountSnapshot!: CombinationDiscountSnapshotEntity | null;

  @OneToMany(
    () => ApplicationOrderPaymentSnapshotEntity,
    (applicationOrderPaymentSnapshot) => applicationOrderPaymentSnapshot.applicationOrder,
    { cascade: true },
  )
  applicationOrderPaymentSnapshots!: ApplicationOrderPaymentSnapshotEntity[];
}
