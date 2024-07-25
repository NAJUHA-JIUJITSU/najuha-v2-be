import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { IApplicationOrder } from '../../../modules/applications/domain/interface/application-order.interface';
import { uuidv7 } from 'uuidv7';
import { EarlybirdDiscountSnapshotEntity } from '../competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from '../competition/combination-discount-snapshot.entity';
import { ApplicationOrderPaymentSnapshotEntity } from './application-order-payment-snapshot.entity';

/**
 * ApplicationOrder.
 *
 * 참가신청 주문 정보.
 * - 참가신청에 대한 주문 정보를 저장합니다.
 * - 참가신청에 대해 결제 실패 등의 이유로 여려개의 주문이 발생할 수 있습니다.
 * @namespace Application
 */
@Entity('application_order')
@Index('IDX_ApplicationOrder_applicationId', ['applicationId'])
export class ApplicationOrderEntity {
  /**
   * UUID v7.
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IApplicationOrder['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IApplicationOrder['createdAt'];

  /**
   * - 주문번호(총 63자)
   * - `${applicationOrder.id}_${competition.competitionPaymentId}` 형태로 생성.
   * - 36자의 applicationOrder.id(uuidv7)와 26자의 competition.competitionPaymentId(ULID)를 조합하여 생성.
   * - ex) 123e4567-e89b-12d3-a456-426614174000_01ARYZ6S41MK3W7DMT3RZR9K9Z
   *
   * Q. 왜 applicationOrder.id와 competition.competitionPaymentId를 조합하여 생성하나요?
   * A. 정산과정에서 동일한 대회의 주문 번호를 식별하기 위함입니다.
   */
  @Column('varchar', { length: 64 })
  orderId!: IApplicationOrder['orderId'];

  /**
   * tosspayments에서 발급받은 결제키.
   * - 결제가 완료되면 발급받은 결제키를 저장합니다.
   * - 결제가 완료되지 않은 경우 null.
   * - 고유한 결제정보를 식별하기 위한 키입니다.
   */
  @Column('varchar', { length: 200, nullable: true })
  paymentKey!: IApplicationOrder['paymentKey'] | null;

  /**
   * 주문명(총 100자)
   * - 신청한 대회의 title이 저장됩니다.
   */
  @Column('varchar', { length: 256 })
  orderName!: IApplicationOrder['orderName'];

  /**
   * 주문자 이름(총 64자)
   */
  @Column('varchar', { length: 64 })
  customerName!: IApplicationOrder['customerName'];

  /**
   * 주문자 이메일(총 320자)
   */
  @Column('varchar', { length: 320 })
  customerEmail!: IApplicationOrder['customerEmail'];

  /**
   * 주문 상태.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - FAIL: 결제 실패
   * - PARTIAL_CANCELED: 부분 취소
   * - CANCELED: 전체 취소
   */
  @Column('varchar', { length: 16, default: 'READY' })
  status!: IApplicationOrder['status'];

  /**
   * 결제 여부.
   */
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
