import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ApplicationEntity } from 'src/infrastructure/database/entities/application/application.entity';
import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/interface/combination-discount-snapshot.interface';

@Entity('combination_discount_snapshot')
export class CombinationDiscountSnapshotEntity {
  @PrimaryGeneratedColumn()
  id: ICombinationDiscountSnapshot['id'];

  @Column('jsonb')
  combinationDiscountRules: ICombinationDiscountSnapshot['combinationDiscountRules'];

  @CreateDateColumn()
  createdAt: ICombinationDiscountSnapshot['createdAt'];

  @Column()
  competitionId: CompetitionEntity['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.combinationDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition: CompetitionEntity;

  // @OneToMany(() => ApplicationEntity, (application) => application.combinationDiscountSnapshot)
  // applications: ApplicationEntity[];
}
