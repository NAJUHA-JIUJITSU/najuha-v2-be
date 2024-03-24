import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  earlbirdDiscountAmount: number;

  /**
   * - combination discount amount.
   * @type uint32
   * @minimum 0
   */
  @Column('int', { unsigned: true })
  combinationDiscountAmount: number;

  /**
   * - total amount = normalAmount - earlbirdDiscountAmount - combinationDiscountAmount.
   * @type uint32
   * @minimum 0
   */
  @Column('int', { unsigned: true })
  totalAmount: number;

  // /**
  //  * - application package id.
  //  */
  // @Column()
  // applicationPackageId: ApplicationPackage['id'];

  // /**
  //  * - application package 정보
  //  * - ManyToOne: ApplicationPackage(1) -> ApplicationPackageSnapshot(*)
  //  */
  // @ManyToOne(() => ApplicationPackage, (applicationPackage) => applicationPackage.applicationPackageSnapshots)
  // @JoinColumn({ name: 'applicationPackageId' })
  // applicationPackage?: ApplicationPackage;
}
