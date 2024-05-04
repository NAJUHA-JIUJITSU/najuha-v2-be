import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { ulid } from 'ulid';
import { IRequiredAdditionalInfo } from 'src/modules/competitions/domain/interface/required-addtional-info.interface';

@Entity('required_additional_info')
export class RequiredAdditionalInfoEntity {
  @Column('varchar', { length: 26, primary: true, default: ulid() })
  id!: IRequiredAdditionalInfo['id'];

  @Column('varchar', { length: 64 })
  type!: IRequiredAdditionalInfo['type'];

  @Column('varchar', { length: 512 })
  description!: IRequiredAdditionalInfo['description'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IRequiredAdditionalInfo['createdAt'];

  @Column()
  competitionId!: ICompetition['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.requiredAdditionalInfos)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
