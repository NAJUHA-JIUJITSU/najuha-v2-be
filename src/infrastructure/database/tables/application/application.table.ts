import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from 'typeorm';
import { PlayerSnapshotTable } from './player-snapshot.table';
import { PaymentSnapshotTable } from '../competition/payment-snapshot.table';
import { CompetitionTable } from '../competition/competition.table';
import { UserTable } from '../user/user.entity';
import { ParticipationDivisionInfoTable } from './participation-division-info.table';
import { IApplication } from 'src/modules/applications/domain/interface/application.interface';

@Entity('application')
export class ApplicationTable {
  @Column('varchar', { length: 26, primary: true })
  id: IApplication['id'];

  @CreateDateColumn()
  createdAt: IApplication['createdAt'];

  @UpdateDateColumn()
  updatedAt: IApplication['updatedAt'];

  @Column('varchar', { length: 16, default: 'READY' })
  status: IApplication['status'];

  @OneToMany(() => PlayerSnapshotTable, (playerSnapshot) => playerSnapshot.application, { cascade: true })
  playerSnapshots: PlayerSnapshotTable[];

  @OneToMany(() => PaymentSnapshotTable, (paymentSnapshot) => paymentSnapshot.application)
  paymentSnapshots: PaymentSnapshotTable[];

  @OneToMany(
    () => ParticipationDivisionInfoTable,
    (participationDivisionInfo) => participationDivisionInfo.application,
    {
      cascade: true,
    },
  )
  participationDivisionInfos: ParticipationDivisionInfoTable[];

  @Column()
  competitionId: CompetitionTable['id'];

  @ManyToOne(() => CompetitionTable, (competition) => competition.applications)
  @JoinColumn({ name: 'competitionId' })
  competition: CompetitionTable;

  @Column()
  userId: UserTable['id'];

  @ManyToOne(() => UserTable, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: UserTable;

  updateReadyApplication(): void {}
}
