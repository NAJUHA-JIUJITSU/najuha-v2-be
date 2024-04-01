import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ParticipationDivisionEntity } from './participation-divsion.entity';
import { DivisionEntity } from '../competition/division.entity';
import { IParticipationDivisionSnapshot } from 'src/modules/applications/domain/structure/participation-division-snapshot.interface';

@Entity('participation_divsion_snapshot')
export class ParticipationDivisionSnapshotEntity {
  @PrimaryGeneratedColumn()
  id: IParticipationDivisionSnapshot['id'];

  @CreateDateColumn()
  createdAt: IParticipationDivisionSnapshot['createdAt'];

  /** - participation division id. */
  @Column()
  participationDivisionId: ParticipationDivisionEntity['id'];

  /** - participation division */
  @ManyToOne(
    () => ParticipationDivisionEntity,
    (participationDivision) => participationDivision.participationDivisionSnapshots,
  )
  @JoinColumn({ name: 'participationDivisionId' })
  participationDivision: ParticipationDivisionEntity;

  /** - division id. */
  @Column()
  divisionId: DivisionEntity['id'];

  /** - division */
  @ManyToOne(() => DivisionEntity, (division) => division.participationDivisionSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division: DivisionEntity;

  // cancleId
  // cancle
}
