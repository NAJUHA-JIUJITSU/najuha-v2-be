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
import { PlayerSnapshotEntity } from './player-snapshot.entity';
import { PaymentSnapshotEntity } from '../competition/payment-snapshot.entity';
import { CompetitionEntity } from '../competition/competition.entity';
import { UserEntity } from '../user/user.entity';
import { ParticipationDivisionEntity } from './participation-divsion.entity';
import { EarlybirdDiscountSnapshotEntity } from '../competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from '../competition/combination-discount-snapshot.entity';
import { IApplication } from 'src/modules/applications/domain/interface/application.interface';

@Entity('application')
export class ApplicationEntity {
  @PrimaryGeneratedColumn()
  id: IApplication['id'];

  @CreateDateColumn()
  createdAt: IApplication['createdAt'];

  @UpdateDateColumn()
  updatedAt: IApplication['updatedAt'];

  @Column('varchar', { length: 16, default: 'READY' })
  status: IApplication['status'];

  @OneToMany(() => PlayerSnapshotEntity, (playerSnapshot) => playerSnapshot.application, { cascade: true })
  playerSnapshots: PlayerSnapshotEntity[];

  @OneToMany(() => PaymentSnapshotEntity, (paymentSnapshot) => paymentSnapshot.application)
  paymentSnapshots: PaymentSnapshotEntity[];

  @OneToMany(() => ParticipationDivisionEntity, (participationDivision) => participationDivision.application, {
    cascade: true,
  })
  participationDivisions: ParticipationDivisionEntity[];

  @Column({ nullable: true })
  earlybirdDiscountSnapshotId: EarlybirdDiscountSnapshotEntity['id'];

  @ManyToOne(
    () => EarlybirdDiscountSnapshotEntity,
    (earlybirdDiscountSnapshot) => earlybirdDiscountSnapshot.applications,
  )
  @JoinColumn({ name: 'earlybirdDiscountSnapshotId' })
  earlybirdDiscountSnapshot: EarlybirdDiscountSnapshotEntity;

  @Column({ nullable: true })
  combinationDiscountSnapshotId: PaymentSnapshotEntity['id'];

  @ManyToOne(
    () => CombinationDiscountSnapshotEntity,
    (combinationDiscountSnapshot) => combinationDiscountSnapshot.applications,
  )
  @JoinColumn({ name: 'combinationDiscountSnapshotId' })
  combinationDiscountSnapshot: CombinationDiscountSnapshotEntity;

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

  //   /**
  //    * - cancel.
  //    */
  //   cancles: Cancel;
}
