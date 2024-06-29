import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { IApplicationPayment } from '../../../modules/applications/domain/interface/application-payment.interface';
import { uuidv7 } from 'uuidv7';
import { EarlybirdDiscountSnapshotEntity } from '../competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from '../competition/combination-discount-snapshot.entity';
import { ApplicationPaymentSnapshotEntity } from './application-payment-snapshot.entity';

/**
 * Application Payment Entity
 * @namespace Application
 */
@Entity('application_payment')
export class ApplicationPaymentEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IApplicationPayment['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IApplicationPayment['createdAt'];

  @Column('varchar', { length: 256 })
  orderName!: IApplicationPayment['orderName'];

  @Column('varchar', { length: 64 })
  customerName!: IApplicationPayment['customerName'];

  @Column('varchar', { length: 320 })
  customerEmail!: IApplicationPayment['customerEmail'];

  @Column('varchar', { length: 16, default: 'READY' })
  status!: IApplicationPayment['status'];

  @Column('uuid')
  applicationId!: IApplicationPayment['applicationId'];

  @Column('uuid')
  earlybirdDiscountSnapshotId!: IApplicationPayment['earlybirdDiscountSnapshotId'];

  @Column('uuid')
  combinationDiscountSnapshotId!: IApplicationPayment['combinationDiscountSnapshotId'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------
  @ManyToOne(() => ApplicationEntity, (application) => application.applicationPayments)
  @JoinColumn({ name: 'applicationId' })
  application!: ApplicationEntity;

  @ManyToOne(
    () => EarlybirdDiscountSnapshotEntity,
    (earlybirdDiscountSnapshot) => earlybirdDiscountSnapshot.applicationPayments,
  )
  @JoinColumn({ name: 'earlybirdDiscountSnapshotId' })
  earlybirdDiscountSnapshot!: EarlybirdDiscountSnapshotEntity;

  @ManyToOne(
    () => CombinationDiscountSnapshotEntity,
    (combinationDiscountSnapshot) => combinationDiscountSnapshot.applicationPayments,
  )
  @JoinColumn({ name: 'combinationDiscountSnapshotId' })
  combinationDiscountSnapshot!: CombinationDiscountSnapshotEntity;

  @OneToMany(
    () => ApplicationPaymentSnapshotEntity,
    (applicationPaymentSnapshot) => applicationPaymentSnapshot.applicationPayment,
  )
  applicationPaymentSnapshots!: ApplicationPaymentSnapshotEntity[];
}
