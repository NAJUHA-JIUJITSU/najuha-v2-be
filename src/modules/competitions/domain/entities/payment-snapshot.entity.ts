import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Application } from '../../../applications/domain/entities/application.entity';

@Entity('payment_snapshot')
export class PaymentSnapshot {
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
  applicationId: Application['id'];

  /** - application. */
  @ManyToOne(() => Application, (application) => application.paymentSnapshots)
  application: Application;
}
