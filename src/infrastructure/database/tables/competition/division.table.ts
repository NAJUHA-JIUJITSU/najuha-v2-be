import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, Unique, UpdateDateColumn } from 'typeorm';
import { CompetitionTable } from './competition.table';
import { PriceSnapshotTable } from './price-snapshot.entity';
import { ParticipationDivisionInfoSnapshotTable } from '../application/participation-division-info-snapshot.table';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';

@Entity('division')
@Unique('UQ_DIVISION', ['category', 'uniform', 'gender', 'belt', 'weight', 'competitionId'])
export class DivisionTable {
  @Column('varchar', { length: 26, primary: true })
  id: IDivision['id'];

  @Column('varchar', { length: 64 })
  category: IDivision['category'];

  @Column('varchar', { length: 16 })
  uniform: IDivision['uniform'];

  @Column('varchar', { length: 16 })
  gender: IDivision['gender'];

  @Column('varchar', { length: 64 })
  belt: IDivision['belt'];

  @Column('varchar', { length: 64 })
  weight: IDivision['weight'];

  @Column('varchar', { length: 4 })
  birthYearRangeStart: IDivision['birthYearRangeStart'];

  @Column('varchar', { length: 4 })
  birthYearRangeEnd: IDivision['birthYearRangeEnd'];

  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status: IDivision['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: IDivision['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: IDivision['updatedAt'];

  @Column()
  competitionId: CompetitionTable['id'];

  @ManyToOne(() => CompetitionTable, (competition) => competition.divisions)
  @JoinColumn({ name: 'competitionId' })
  competition: CompetitionTable;

  @OneToMany(() => PriceSnapshotTable, (priceSnapshot) => priceSnapshot.division, { cascade: true, eager: true })
  priceSnapshots: PriceSnapshotTable[];

  @OneToMany(
    () => ParticipationDivisionInfoSnapshotTable,
    (participationDivisionInfoSnapshot) => participationDivisionInfoSnapshot.division,
  )
  participationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotTable[];
}
