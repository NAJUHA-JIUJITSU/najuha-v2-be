import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, Unique, UpdateDateColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { PriceSnapshotEntity } from './price-snapshot.entity';
import { ParticipationDivisionInfoSnapshotEntity } from '../application/participation-division-info-snapshot.entity';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { uuidv7 } from 'uuidv7';

/**
 * Division Entity
 * @namespace Competition
 */
@Entity('division')
@Unique('UQ_DIVISION', ['category', 'uniform', 'gender', 'belt', 'weight', 'competitionId'])
export class DivisionEntity {
  @Column('varchar', { length: 36, primary: true, default: uuidv7() })
  id!: IDivision['id'];

  @Column('varchar', { length: 64 })
  category!: IDivision['category'];

  @Column('varchar', { length: 16 })
  uniform!: IDivision['uniform'];

  @Column('varchar', { length: 16 })
  gender!: IDivision['gender'];

  @Column('varchar', { length: 64 })
  belt!: IDivision['belt'];

  @Column('varchar', { length: 64 })
  weight!: IDivision['weight'];

  @Column('varchar', { length: 4 })
  birthYearRangeStart!: IDivision['birthYearRangeStart'];

  @Column('varchar', { length: 4 })
  birthYearRangeEnd!: IDivision['birthYearRangeEnd'];

  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status!: IDivision['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IDivision['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: IDivision['updatedAt'];

  @Column()
  competitionId!: CompetitionEntity['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.divisions)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;

  /**
   * @minitems 1
   */
  @OneToMany(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.division, { cascade: true, eager: true })
  priceSnapshots!: PriceSnapshotEntity[];

  @OneToMany(
    () => ParticipationDivisionInfoSnapshotEntity,
    (participationDivisionInfoSnapshot) => participationDivisionInfoSnapshot.division,
  )
  participationDivisionInfoSnapshots!: ParticipationDivisionInfoSnapshotEntity[];
}
