import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { IApplicationOrderPaymentSnapshot } from '../../../modules/applications/domain/interface/application-order-payment-sanpshot.interface';
import { ApplicationOrderEntity } from './application-order.entity';
import { ParticipationDivisionInfoPaymentEntity } from './participation-division-info-payment.entity';

/**
 * ApplicationOrderPaymentSnapshot.
 *
 * 참가신청에 대한 결제 정보.
 * @namespace Application
 */
@Entity('application_order_payment_snapshot')
@Index('IDX_ApplicationOrderPaymentSnapshot_applicationOrderId', ['applicationOrderId'])
export class ApplicationOrderPaymentSnapshotEntity {
  /**
   * UUID v7.
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IApplicationOrderPaymentSnapshot['id'];

  /**
   * createdAt.
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IApplicationOrderPaymentSnapshot['createdAt'];

  /**
   * 할인이 적용되지 않은 총 금액 (원).
   */
  @Column('int', { unsigned: true })
  normalAmount!: IApplicationOrderPaymentSnapshot['normalAmount'];

  /**
   * 얼리버드 할인 규칙에의해 할인된 금액. (원).
   */
  @Column('int', { unsigned: true })
  earlybirdDiscountAmount!: IApplicationOrderPaymentSnapshot['earlybirdDiscountAmount'];

  /**
   * 조합할인 규칙에의해 할인된 금액. (원).
   */
  @Column('int', { unsigned: true })
  combinationDiscountAmount!: IApplicationOrderPaymentSnapshot['combinationDiscountAmount'];

  /**
   * 할인이 적용된 최종금액. (원).
   * - 계산 방법 : normalAmount - earlybirdDiscountAmount - combinationDiscountAmount.
   */
  @Column('int', { unsigned: true })
  totalAmount!: IApplicationOrderPaymentSnapshot['totalAmount'];

  /**
   * - application id.
   */
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
