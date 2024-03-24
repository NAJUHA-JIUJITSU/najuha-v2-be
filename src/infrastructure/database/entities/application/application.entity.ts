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
import { PlayerSnapshotEntity } from './player-snapshot.entity';
import { PaymentSnapshotEntity } from './payment-snapshot.entity';
import { CompetitionEntity } from '../competition/competition.entity';
import { UserEntity } from '../user/user.entity';
import { ParticipationDivisionEntity } from './participation-divsion.entity';
import { EarlybirdDiscountSnapshotEntity } from '../competition/early-bird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from '../competition/combination-discount-snapshot.entity';

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

  /** - player snapshots. */
  @OneToMany(() => PlayerSnapshotEntity, (playerSnapshot) => playerSnapshot.application)
  playerSnapshots?: PlayerSnapshotEntity[];

  /** - payment snapshot. */
  @OneToMany(() => PlayerSnapshotEntity, (playerSnapshot) => playerSnapshot.application)
  paymentSnapshot?: PaymentSnapshotEntity;

  /** - participation division. */
  @OneToMany(() => PlayerSnapshotEntity, (playerSnapshot) => playerSnapshot.application)
  participationDivisions?: ParticipationDivisionEntity;

  /** - earlybird discount snapshot id. */
  @Column()
  earlybirdDiscountSnapshotId?: EarlybirdDiscountSnapshotEntity['id'];

  /** - earlybird discount snapshot. */
  @OneToOne(() => PaymentSnapshotEntity)
  @JoinColumn({ name: 'earlybirdDiscountSnapshotId' })
  earlybirdDiscountSnapshot?: EarlybirdDiscountSnapshotEntity;

  /** - combination discount snapshot id. */
  @Column()
  combinationDiscountSnapshotId?: PaymentSnapshotEntity['id'];

  /** - combination discount snapshot. */
  @OneToOne(() => PaymentSnapshotEntity)
  @JoinColumn({ name: 'combinationDiscountSnapshotId' })
  combinationDiscountSnapshot?: CombinationDiscountSnapshotEntity;

  /** - competition id. */
  @Column()
  competitionId: CompetitionEntity['id'];

  /** - competition. */
  @ManyToOne(() => CompetitionEntity, (competition) => competition.applications)
  @JoinColumn({ name: 'competitionId' })
  competition?: CompetitionEntity;

  /** - user id. */
  @Column()
  userId: UserEntity['id'];

  /** - user, 신청자 계정정보. */
  @ManyToOne(() => UserEntity, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  //   /**
  //    * - cancel.
  //    */
  //   cancles?: Cancel;
}
