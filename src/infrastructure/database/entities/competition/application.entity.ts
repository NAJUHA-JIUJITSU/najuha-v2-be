import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PriceSnapshotEntity } from './price-snapshot.entity';
import { ApplicationPackageEntity } from './application-package.entity';

@Entity('application')
export class ApplicationEntity {
  /**
   * - application id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  @CreateDateColumn()
  createdAt: Date | string;

  /**
   * - 엔티티가 수정될 때마다 업데이트되는 최종 업데이트 시간.
   */
  @UpdateDateColumn()
  updatedAt: Date | string;

  /**
   * - status.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   */
  @Column('varchar', { length: 16, default: 'READY' })
  status: 'READY' | 'DONE' | 'CANCELED';

  /** - payed price snapshot id. */
  @Column()
  payedPriceSnapshotId: number | null;

  /**
   * - payed price snapshot.
   * - 결제 당시에 적용된 가격 스냅샷.
   * - 결제 이전에는 null로 설정됩니다.
   * - 환불, 부분환불시에 사용됩니다.
   * - ManyToOne: PriceSnapshot(1) -> Application(*)
   */
  @ManyToOne(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.applications)
  @JoinColumn({ name: 'payedPriceSnapshotId' })
  payedPriceSnapshot?: PriceSnapshotEntity;

  @Column()
  applicationPackageId: number;

  @ManyToOne(() => ApplicationPackageEntity, (applicationPackage) => applicationPackage.applications)
  @JoinColumn({ name: 'applicationPackageId' })
  applicationPackage?: ApplicationPackageEntity;

  //   /**
  //    * - cancel id.
  //    */
  //   cancelId: number | null;

  //   /**
  //    * - cancel.
  //    */
  //   cancle?: Cancel | null;
}
