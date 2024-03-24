import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerSnapshot } from './player-snapshot.entity';
import { PaymentSnapshot } from './payment-snapshot.entity';
import { Competition } from '../competition/competition.entity';
import { User } from '../user/user.entity';
import { ParticipationDivision } from './participation-divsion.entity';
import { EarlybirdDiscountSnapshot } from '../competition/early-bird-discount-snapshot.entity';
import { CombinationDiscountSnapshot } from '../competition/combination-discount-snapshot.entity';

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
  @OneToMany(() => PlayerSnapshot, (playerSnapshot) => playerSnapshot.application)
  playerSnapshots?: PlayerSnapshot[];

  /** - payment snapshot. */
  @OneToMany(() => PaymentSnapshot, (paymentSnapshot) => paymentSnapshot.application)
  paymentSnapshots?: PaymentSnapshot[];

  /** - participation division. */
  @OneToMany(() => ParticipationDivision, (participationDivision) => participationDivision.application)
  participationDivisions?: ParticipationDivision[];

  /** - earlybird discount snapshot id. */
  @Column()
  earlybirdDiscountSnapshotId?: EarlybirdDiscountSnapshot['id'];

  /** - earlybird discount snapshot. */
  @OneToOne(() => EarlybirdDiscountSnapshot)
  @JoinColumn({ name: 'earlybirdDiscountSnapshotId' })
  earlybirdDiscountSnapshot?: EarlybirdDiscountSnapshot;

  /** - combination discount snapshot id. */
  @Column()
  combinationDiscountSnapshotId?: PaymentSnapshot['id'];

  /** - combination discount snapshot. */
  @OneToOne(() => CombinationDiscountSnapshot)
  @JoinColumn({ name: 'combinationDiscountSnapshotId' })
  combinationDiscountSnapshot?: CombinationDiscountSnapshot;

  /** - competition id. */
  @Column()
  competitionId: Competition['id'];

  /** - competition. */
  @ManyToOne(() => Competition, (competition) => competition.applications)
  @JoinColumn({ name: 'competitionId' })
  competition?: Competition;

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
  //   cancles?: Cancel;
}
