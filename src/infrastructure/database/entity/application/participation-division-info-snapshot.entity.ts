import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ParticipationDivisionInfoEntity } from './participation-division-info.entity';
import { DivisionEntity } from '../competition/division.entity';
import { IParticipationDivisionInfoSnapshot } from 'src/modules/applications/domain/interface/participation-division-info-snapshot.interface';
import { ulid } from 'ulid';

@Entity('participation_divsion_info_snapshot')
export class ParticipationDivisionInfoSnapshotEntity {
  @Column('varchar', { length: 26, primary: true, default: ulid() })
  id!: IParticipationDivisionInfoSnapshot['id'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IParticipationDivisionInfoSnapshot['createdAt'];

  @Column()
  participationDivisionInfoId!: ParticipationDivisionInfoEntity['id'];

  @ManyToOne(
    () => ParticipationDivisionInfoEntity,
    (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoSnapshots,
  )
  @JoinColumn({ name: 'participationDivisionInfoId' })
  participationDivisionInfo!: ParticipationDivisionInfoEntity;

  @Column()
  participationDivisionId!: DivisionEntity['id'];

  @ManyToOne(() => DivisionEntity, (division) => division.participationDivisionInfoSnapshots)
  @JoinColumn({ name: 'participationDivisionId' })
  division!: DivisionEntity;
}
