import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { ulid } from 'ulid';
import { IRequiredAddtionalInfo } from 'src/modules/competitions/domain/interface/required-addtional-info.interface';

@Entity('required_addtional_info')
export class RequiredAddtionalInfoEntity {
  @Column('varchar', { length: 26, primary: true, default: ulid() })
  id!: IRequiredAddtionalInfo['id'];

  @Column('varchar', { length: 64 })
  type!: IRequiredAddtionalInfo['type'];

  @Column('varchar', { length: 512 })
  description!: IRequiredAddtionalInfo['description'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IRequiredAddtionalInfo['createdAt'];

  @Column()
  competitionId!: ICompetition['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.requiredAddtionalInfos)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
