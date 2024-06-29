import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, PrimaryColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ICombinationDiscountSnapshot } from '../../../modules/competitions/domain/interface/combination-discount-snapshot.interface';
import { ICompetition } from '../../../modules/competitions/domain/interface/competition.interface';
import { uuidv7 } from 'uuidv7';
import { ApplicationPaymentEntity } from '../application/application-payment.entity';

/**
 * CombinationDiscountSnapshot Entity
 * @namespace Competition
 */
@Entity('combination_discount_snapshot')
@Index('IDX_CombinationDiscountSnapshot_competitionId', ['competitionId'])
export class CombinationDiscountSnapshotEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ICombinationDiscountSnapshot['id'];

  @Column('jsonb')
  combinationDiscountRules!: ICombinationDiscountSnapshot['combinationDiscountRules'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICombinationDiscountSnapshot['createdAt'];

  @Column('uuid')
  competitionId!: ICompetition['id'];

  // -----------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------
  @ManyToOne(() => CompetitionEntity, (competition) => competition.combinationDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;

  @OneToMany(() => ApplicationPaymentEntity, (applicationPayment) => applicationPayment.combinationDiscountSnapshot)
  applicationPayments!: ApplicationPaymentEntity[];
}
