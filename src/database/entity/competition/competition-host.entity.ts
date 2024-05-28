import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { uuidv7 } from 'uuidv7';
import { UserEntity } from '../user/user.entity';
import { ICompetitionHostMap } from 'src/modules/competitions/domain/interface/competition-host-map.interface';

/**
 * Competition Host Map Entity
 * @namespace Competition
 */
@Entity('competition_host_map')
export class CompetitionHostMapEntity {
  @Column('varchar', { length: 36, primary: true, default: uuidv7() })
  id!: ICompetitionHostMap['id'];

  @Column()
  hostId!: ICompetitionHostMap['hostId'];

  @Column()
  competitionId!: ICompetitionHostMap['competitionId'];

  @ManyToOne(() => UserEntity, (user) => user.competitionHostMaps)
  @JoinColumn({ name: 'hostId' })
  user!: UserEntity;

  @ManyToOne(() => CompetitionEntity, (competition) => competition.competitionHostMaps)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
