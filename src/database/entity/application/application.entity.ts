import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { PlayerSnapshotEntity } from './player-snapshot.entity';
import { PaymentSnapshotEntity } from './payment-snapshot.entity';
import { CompetitionEntity } from '../competition/competition.entity';
import { UserEntity } from '../user/user.entity';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { IApplication } from 'src/modules/applications/domain/interface/application.interface';
import { uuidv7 } from 'uuidv7';
import { AdditionalInfoEntity } from './additional-info.entity';

/**
 * Application Entity
 * @namespace Application
 */
@Entity('application')
@Index('IDX_Application_userId_createdAt', ['userId', 'createdAt'])
export class ApplicationEntity {
  @Column('varchar', { length: 36, primary: true, default: uuidv7() })
  id!: IApplication['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IApplication['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: IApplication['updatedAt'];

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: IApplication['deletedAt'];

  @Column('varchar', { length: 16, default: 'SELF' })
  type!: IApplication['type'];

  @Column('varchar', { length: 16, default: 'READY' })
  status!: IApplication['status'];

  @Column()
  competitionId!: CompetitionEntity['id'];

  @Column()
  userId!: UserEntity['id'];

  /**
   * @minitems 1
   */
  @OneToMany(() => PlayerSnapshotEntity, (playerSnapshot) => playerSnapshot.application, { cascade: true })
  playerSnapshots!: PlayerSnapshotEntity[];

  @OneToMany(() => PaymentSnapshotEntity, (paymentSnapshot) => paymentSnapshot.application)
  paymentSnapshots!: PaymentSnapshotEntity[];

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
  additionalInfos!: AdditionalInfoEntity[];
}
