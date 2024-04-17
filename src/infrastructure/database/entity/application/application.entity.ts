import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { PlayerSnapshotEntity } from './player-snapshot.entity';
import { PaymentSnapshotEntity } from '../competition/payment-snapshot.entity';
import { CompetitionEntity } from '../competition/competition.entity';
import { UserEntity } from '../user/user.entity';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { IApplication } from 'src/modules/applications/domain/interface/application.interface';

@Entity('application')
export class ApplicationEntity {
  @Column('varchar', { length: 26, primary: true })
  id: IApplication['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: IApplication['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: IApplication['updatedAt'];

  @Column('varchar', { length: 16, default: 'SELF' })
  type: IApplication['type'];

  @Column('varchar', { length: 16, default: 'READY' })
  status: IApplication['status'];

  @OneToMany(() => PlayerSnapshotEntity, (playerSnapshot) => playerSnapshot.application, { cascade: true })
  playerSnapshots: PlayerSnapshotEntity[];

  @OneToMany(() => PaymentSnapshotEntity, (paymentSnapshot) => paymentSnapshot.application)
  paymentSnapshots: PaymentSnapshotEntity[];

  @OneToMany(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.application,
    {
      cascade: true,
    },
  )
  participationDivisionInfos: ParticipationDivisionInfoEntity[];

  @Column()
  competitionId: CompetitionEntity['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.applications)
  @JoinColumn({ name: 'competitionId' })
  competition: CompetitionEntity;

  @Column()
  userId: UserEntity['id'];

  @ManyToOne(() => UserEntity, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  updateReadyApplication(): void {}
}
