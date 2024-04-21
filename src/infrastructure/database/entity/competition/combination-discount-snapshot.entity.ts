import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/interface/combination-discount-snapshot.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';

@Entity('combination_discount_snapshot')
export class CombinationDiscountSnapshotEntity {
  @Column('varchar', { length: 26, primary: true })
  id!: ICombinationDiscountSnapshot['id'];

  @Column('jsonb')
  combinationDiscountRules!: ICombinationDiscountSnapshot['combinationDiscountRules'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICombinationDiscountSnapshot['createdAt'];

  @Column()
  competitionId!: ICompetition['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.combinationDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
