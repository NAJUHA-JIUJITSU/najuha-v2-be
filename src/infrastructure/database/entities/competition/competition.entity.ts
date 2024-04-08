import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DivisionEntity } from './division.entity';
import { EarlybirdDiscountSnapshotEntity } from './earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from './combination-discount-snapshot.entity';
import { ApplicationEntity } from '../application/application.entity';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';

@Entity('competition')
export class CompetitionEntity {
  @PrimaryGeneratedColumn()
  id: ICompetition['id'];

  @Column('varchar', { length: 256, default: 'DEFAULT TITLE' })
  title: ICompetition['title'];

  @Column('varchar', { length: 256, default: 'DEFAULT ADDRESS' })
  address: ICompetition['address'];

  @Column('timestamp', { nullable: true })
  competitionDate: ICompetition['competitionDate'];

  @Column('timestamp', { nullable: true })
  registrationStartDate: ICompetition['registrationStartDate'];

  @Column('timestamp', { nullable: true })
  registrationEndDate: ICompetition['registrationEndDate'];

  @Column('timestamp', { nullable: true })
  refundDeadlineDate: ICompetition['refundDeadlineDate'];

  @Column('timestamp', { nullable: true })
  soloRegistrationAdjustmentStartDate: ICompetition['soloRegistrationAdjustmentStartDate'];

  @Column('timestamp', { nullable: true })
  soloRegistrationAdjustmentEndDate: ICompetition['soloRegistrationAdjustmentEndDate'];

  @Column('timestamp', { nullable: true })
  registrationListOpenDate: ICompetition['registrationListOpenDate'];

  @Column('timestamp', { nullable: true })
  bracketOpenDate: ICompetition['bracketOpenDate'];

  @Column('text', { default: 'DEFAULT DESCRIPTION' })
  description: ICompetition['description'];

  @Column('boolean', { default: false })
  isPartnership: ICompetition['isPartnership'];

  @Column('int', { default: 0 })
  viewCount: ICompetition['viewCount'];

  @Column('varchar', { length: 256, nullable: true })
  posterImgUrlKey: ICompetition['posterImgUrlKey'];

  @Column('varchar', { length: 16, default: 'INACTIVE' })
  status: ICompetition['status'];

  @CreateDateColumn()
  createdAt: ICompetition['createdAt'];

  @UpdateDateColumn()
  updatedAt: ICompetition['updatedAt'];

  @OneToMany(
    () => EarlybirdDiscountSnapshotEntity,
    (earlyBirdDiscountSnapshot) => earlyBirdDiscountSnapshot.competition,
  )
  earlybirdDiscountSnapshots: EarlybirdDiscountSnapshotEntity[];

  @OneToMany(
    () => CombinationDiscountSnapshotEntity,
    (combinationDiscountSnapshot) => combinationDiscountSnapshot.competition,
  )
  combinationDiscountSnapshots: CombinationDiscountSnapshotEntity[];

  @OneToMany(() => DivisionEntity, (division) => division.competition, { cascade: true })
  divisions: DivisionEntity[];

  @OneToMany(() => ApplicationEntity, (application) => application.competition)
  applications: ApplicationEntity[];
}
