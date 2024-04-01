import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';

@Entity('payment_snapshot')
export class PaymentSnapshotEntity {
  /**
   * - application package snapshot id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /** - entity 생성 시간. */
  @CreateDateColumn()
  createdAt: Date | string;

  /**
   * - pacage total amount.
   * @type uint32
   * @minimum 0
   */
  @Column('int', { unsigned: true })
  normalAmount: number;

  /**
   * - earlybird discount amount.
   * @type uint32
   * @minimum 0
   */
  @Column('int', { unsigned: true })
  earlybirdDiscountAmount: number;

  /**
   * - combination discount amount.
   * @type uint32
   * @minimum 0
   */
  @Column('int', { unsigned: true })
  combinationDiscountAmount: number;

  /**
   * - total amount = normalAmount - earlybirdDiscountAmount - combinationDiscountAmount.
   * @type uint32
   * @minimum 0
   */
  @Column('int', { unsigned: true })
  totalAmount: number;

  /** - application id. */
  @Column()
  applicationId: ApplicationEntity['id'];

  /** - application. */
  @ManyToOne(() => ApplicationEntity, (application) => application.paymentSnapshots)
  application: ApplicationEntity;
}
