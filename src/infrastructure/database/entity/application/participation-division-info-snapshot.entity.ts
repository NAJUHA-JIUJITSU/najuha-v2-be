import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { DivisionEntity } from '../competition/division.entity';
import { IParticipationDivisionInfoSnapshot } from 'src/modules/applications/domain/interface/participation-division-info-snapshot.interface';

@Entity('participation_divsion_info_snapshot')
export class ParticipationDivisionInfoSnapshotEntity {
  @Column('varchar', { length: 26, primary: true })
  id!: IParticipationDivisionInfoSnapshot['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfoSnapshot['createdAt'];

  /** - participation division id. */
  @Column()
  participationDivisionInfoId!: ParticipationDivisionInfoEntity['id'];

  /** - participation division */
  @ManyToOne(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoSnapshots,
  )
  @JoinColumn({ name: 'participationDivisionInfoId' })
  participationDivisionInfo!: ParticipationDivisionInfoEntity;

  /** - division id. */
  @Column()
  participationDivisionId!: DivisionEntity['id'];

  /** - division */
  @ManyToOne(() => DivisionEntity, (division) => division.participationDivisionInfoSnapshots)
  @JoinColumn({ name: 'participationDivisionId' })
  division!: DivisionEntity;
}
