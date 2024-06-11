import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ICompetition } from '../../../modules/competitions/domain/interface/competition.interface';
import { uuidv7 } from 'uuidv7';
import { IRequiredAdditionalInfo } from '../../../modules/competitions/domain/interface/required-addtional-info.interface';

/**
 * RequiredAdditionalInfo Entity
 * @namespace Competition
 */
@Entity('required_additional_info')
@Index('IDX_RequiredAdditionalInfo_competitionId', ['competitionId'])
export class RequiredAdditionalInfoEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IRequiredAdditionalInfo['id'];

  @Column('varchar', { length: 64 })
  type!: IRequiredAdditionalInfo['type'];

  @Column('varchar', { length: 512 })
  description!: IRequiredAdditionalInfo['description'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IRequiredAdditionalInfo['createdAt'];

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: IRequiredAdditionalInfo['deletedAt'];

  @Column('uuid')
  competitionId!: ICompetition['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.requiredAdditionalInfos)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
