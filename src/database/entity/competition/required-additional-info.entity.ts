import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { uuidv7 } from 'uuidv7';
import { IRequiredAdditionalInfo } from 'src/modules/competitions/domain/interface/required-addtional-info.interface';

@Entity('required_additional_info')
export class RequiredAdditionalInfoEntity {
  @Column('varchar', { length: 36, primary: true, default: uuidv7() })
  id!: IRequiredAdditionalInfo['id'];

  @Column('varchar', { length: 64 })
  type!: IRequiredAdditionalInfo['type'];

  @Column('varchar', { length: 512 })
  description!: IRequiredAdditionalInfo['description'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IRequiredAdditionalInfo['createdAt'];

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: IRequiredAdditionalInfo['deletedAt'];

  @Column()
  competitionId!: ICompetition['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.requiredAdditionalInfos)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
