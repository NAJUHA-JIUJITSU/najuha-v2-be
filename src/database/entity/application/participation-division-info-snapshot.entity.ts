import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { DivisionEntity } from '../competition/division.entity';
import { IParticipationDivisionInfoSnapshot } from '../../../modules/applications/domain/interface/participation-division-info-snapshot.interface';
import { uuidv7 } from 'uuidv7';

/**
 * ParticipationDivisionInfoSnapshot Entity
 * @namespace Application
 */
@Entity('participation_division_info_snapshot')
@Index('IDX_ParticipationDivisionInfoSnapshot_participationDivisionInfoId', ['participationDivisionInfoId'])
export class ParticipationDivisionInfoSnapshotEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IParticipationDivisionInfoSnapshot['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfoSnapshot['createdAt'];

  @Column('uuid')
  participationDivisionInfoId!: ParticipationDivisionInfoEntity['id'];

  @Column('uuid')
  divisionId!: DivisionEntity['id'];

  @ManyToOne(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoSnapshots,
  )
  @JoinColumn({ name: 'participationDivisionInfoId' })
  participationDivisionInfo!: ParticipationDivisionInfoEntity;

  @ManyToOne(() => DivisionEntity, (division) => division.participationDivisionInfoSnapshots)
  @JoinColumn({ name: 'participationDivisionId' })
  division!: DivisionEntity;
}
