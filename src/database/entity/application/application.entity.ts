import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerSnapshotEntity } from './player-snapshot.entity';
import { CompetitionEntity } from '../competition/competition.entity';
import { UserEntity } from '../user/user.entity';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { IApplication } from '../../../modules/applications/domain/interface/application.interface';
import { uuidv7 } from 'uuidv7';
import { AdditionalInfoEntity } from './additional-info.entity';
import { ApplicationOrderEntity } from './application-order.entity';

/**
 * Application.
 *
 * 대회 참가 신청 정보.
 * @namespace Application
 */
@Entity('application')
@Index('IDX_Application_userId_createdAt', ['userId', 'createdAt'])
export class ApplicationEntity {
  /**
   * UUID v7.
   */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IApplication['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IApplication['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: IApplication['updatedAt'];

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: IApplication['deletedAt'];

  /**
   * 본인신청과 대리신청을 구별하는 type.
   * - SELF: 본인 신청
   * - PROXY: 대리 신청
   */
  @Column('varchar', { length: 16, default: 'SELF' })
  type!: IApplication['type'];

  /**
   * 대회 신청 상태.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - PARTIAL_CANCELED: 부분 취소
   * - CANCELED: 전체 취소
   */
  @Column('varchar', { length: 16, default: 'READY' })
  status!: IApplication['status'];

  /** 참가 대회 id */
  @Column('uuid')
  competitionId!: CompetitionEntity['id'];

  /** 신청자 계정의 userId */
  @Column('uuid')
  userId!: UserEntity['id'];

  /**
   * @minitems 1
   */
  @OneToMany(() => PlayerSnapshotEntity, (playerSnapshot) => playerSnapshot.application, { cascade: true })
  playerSnapshots!: PlayerSnapshotEntity[];

  @OneToMany(() => ApplicationOrderEntity, (applicationOrder) => applicationOrder.application, { cascade: true })
  applicationOrders!: ApplicationOrderEntity[];

  /**
   * @minitems 1
   */
  @OneToMany(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.application,
    { cascade: true },
  )
  participationDivisionInfos!: ParticipationDivisionInfoEntity[];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.applications)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;

  @ManyToOne(() => UserEntity, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @OneToMany(() => AdditionalInfoEntity, (additionalInfo) => additionalInfo.application, { cascade: true })
  additionaInfos!: AdditionalInfoEntity[];
}
