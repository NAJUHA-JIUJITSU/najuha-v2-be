import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { PriceSnapshotEntity } from './price-snapshot.entity';
import { ParticipationDivisionSnapshotEntity } from '../application/participation-division-snapshot.entity';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';

@Entity('division')
@Unique('UQ_DIVISION', ['category', 'uniform', 'gender', 'belt', 'weight', 'competitionId'])
export class DivisionEntity {
  @PrimaryGeneratedColumn()
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

  @CreateDateColumn()
  createdAt: IDivision['createdAt'];

  @UpdateDateColumn()
  updatedAt: IDivision['updatedAt'];

  @Column()
  competitionId: CompetitionEntity['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.divisions)
  @JoinColumn({ name: 'competitionId' })
  competition: CompetitionEntity;

  @OneToMany(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.division, { cascade: true, eager: true })
  priceSnapshots: PriceSnapshotEntity[];

  @OneToMany(
    () => ParticipationDivisionSnapshotEntity,
    (participationDivisionSnapshot) => participationDivisionSnapshot.division,
  )
  participationDivisionSnapshots: ParticipationDivisionSnapshotEntity[];
}
