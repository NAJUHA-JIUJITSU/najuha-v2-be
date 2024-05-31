import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, Index, PrimaryColumn } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { uuidv7 } from 'uuidv7';

/**
 * EarlybirdDiscountSnapshot Entity
 * @namespace Competition
 */
@Entity('earlybird_discount_snapshot')
@Index('IDX_EarlybirdDiscountSnapshot_competitionId', ['competitionId'])
export class EarlybirdDiscountSnapshotEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IEarlybirdDiscountSnapshot['id'];

  @Column('timestamptz')
  earlybirdStartDate!: IEarlybirdDiscountSnapshot['earlybirdStartDate'];

  @Column('timestamptz')
  earlybirdEndDate!: IEarlybirdDiscountSnapshot['earlybirdEndDate'];

  @Column('int')
  discountAmount!: IEarlybirdDiscountSnapshot['discountAmount'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IEarlybirdDiscountSnapshot['createdAt'];

  @Column('uuid')
  competitionId!: CompetitionEntity['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.earlybirdDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
