import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../user/user.entity';
import { ICompetitionHostMap } from '../../../modules/competitions/domain/interface/competition-host-map.interface';

/**
 * Competition Host Map Entity
 * @namespace Competition
 */
@Entity('competition_host_map')
@Index('IDX_CompetitionHostMap_competitionId', ['competitionId'])
export class CompetitionHostMapEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ICompetitionHostMap['id'];

  /** 주최자 User ID. */
  @Column('uuid')
  hostId!: ICompetitionHostMap['hostId'];

  /** 주체 대회 ID. */
  @Column('uuid')
  competitionId!: ICompetitionHostMap['competitionId'];

  @ManyToOne(() => UserEntity, (user) => user.competitionHostMaps)
  @JoinColumn({ name: 'hostId' })
  user!: UserEntity;

  @ManyToOne(() => CompetitionEntity, (competition) => competition.competitionHostMaps)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
