import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerSnapshot } from './player-snapshot.entity';
import { PaymentSnapshot } from '../../../competitions/domain/entities/payment-snapshot.entity';
import { Competition } from '../../../competitions/domain/entities/competition.entity';
import { User } from '../../../users/domain/entities/user.entity';
import { ParticipationDivision } from './participation-divsion.entity';
import { EarlybirdDiscountSnapshot } from '../../../competitions/domain/entities/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshot } from '../../../competitions/domain/entities/combination-discount-snapshot.entity';

@Entity('application')
export class Application {
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

  /** - player snapshots. */
  @OneToMany(() => PlayerSnapshot, (playerSnapshot) => playerSnapshot.application, { cascade: true })
  playerSnapshots: PlayerSnapshot[];

  /** - payment snapshot. */
  @OneToMany(() => PaymentSnapshot, (paymentSnapshot) => paymentSnapshot.application)
  paymentSnapshots: PaymentSnapshot[];

  /** - participation division. */
  @OneToMany(() => ParticipationDivision, (participationDivision) => participationDivision.application, {
    cascade: true,
  })
  participationDivisions: ParticipationDivision[];

  /** - earlybird discount snapshot id. */
  @Column({ nullable: true })
  earlybirdDiscountSnapshotId: EarlybirdDiscountSnapshot['id'];

  /** - earlybird discount snapshot. */
  @ManyToOne(() => EarlybirdDiscountSnapshot, (earlybirdDiscountSnapshot) => earlybirdDiscountSnapshot.applications)
  @JoinColumn({ name: 'earlybirdDiscountSnapshotId' })
  earlybirdDiscountSnapshot: EarlybirdDiscountSnapshot;

  /** - combination discount snapshot id. */
  @Column({ nullable: true })
  combinationDiscountSnapshotId: PaymentSnapshot['id'];

  /** - combination discount snapshot. */
  @ManyToOne(
    () => CombinationDiscountSnapshot,
    (combinationDiscountSnapshot) => combinationDiscountSnapshot.applications,
  )
  @JoinColumn({ name: 'combinationDiscountSnapshotId' })
  combinationDiscountSnapshot: CombinationDiscountSnapshot;

  /** - competition id. */
  @Column()
  competitionId: Competition['id'];

  /** - competition. */
  @ManyToOne(() => Competition, (competition) => competition.applications)
  @JoinColumn({ name: 'competitionId' })
  competition: Competition;

  /** - user id. */
  @Column()
  userId: User['id'];

  /** - user, 신청자 계정정보. */
  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: User;

  //   /**
  //    * - cancel.
  //    */
  //   cancles: Cancel;

  // ----------------- Mathods -----------------
  calculatePaymentSnapshot() {
    const normalAmount = this.participationDivisions.reduce((acc, cur) => {
      return acc + cur.priceSnapshot.price;
    }, 0);
    console.log('normalAmount', normalAmount);
    const earlybirdDiscountAmount = this.earlybirdDiscountSnapshot.discountAmount;
    console.log('earlybirdDiscountAmount', earlybirdDiscountAmount);
    const combinationDiscountAmount = 0;
    const totalAmount = normalAmount - earlybirdDiscountAmount - combinationDiscountAmount;
    return { normalAmount, earlybirdDiscountAmount, combinationDiscountAmount, totalAmount };
  }
}
