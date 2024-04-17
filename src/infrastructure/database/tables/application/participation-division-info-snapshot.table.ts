import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ParticipationDivisionInfoTable } from './participation-division-info.table';
import { DivisionTable } from '../competition/division.table';
import { IParticipationDivisionInfoSnapshot } from 'src/modules/applications/domain/interface/participation-division-info-snapshot.interface';

@Entity('participation_divsion_info_snapshot')
export class ParticipationDivisionInfoSnapshotTable {
  @Column('varchar', { length: 26, primary: true })
  id: IParticipationDivisionInfoSnapshot['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: IParticipationDivisionInfoSnapshot['createdAt'];

  /** - participation division id. */
  @Column()
  participationDivisionInfoId: ParticipationDivisionInfoTable['id'];

  /** - participation division */
  @ManyToOne(
    () => ParticipationDivisionInfoTable,
    (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoSnapshots,
  )
  @JoinColumn({ name: 'participationDivisionInfoId' })
  participationDivisionInfo: ParticipationDivisionInfoTable;

  /** - division id. */
  @Column()
  participationDivisionId: DivisionTable['id'];

  /** - division */
  @ManyToOne(() => DivisionTable, (division) => division.participationDivisionInfoSnapshots)
  @JoinColumn({ name: 'participationDivisionId' })
  division: DivisionTable;
}
