import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  // applicationPackageId: ApplicationPackageEntity['id'];

  // /**
  //  * - application package 정보
  //  * - ManyToOne: ApplicationPackage(1) -> ApplicationPackageSnapshot(*)
  //  */
  // @ManyToOne(() => ApplicationPackageEntity, (applicationPackage) => applicationPackage.applicationPackageSnapshots)
  // @JoinColumn({ name: 'applicationPackageId' })
  // applicationPackage?: ApplicationPackageEntity;
}
