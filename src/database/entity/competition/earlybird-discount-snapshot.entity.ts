import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { uuidv7 } from 'uuidv7';

@Entity('earlybird_discount_snapshot')
export class EarlybirdDiscountSnapshotEntity {
  @Column('varchar', { length: 36, primary: true, default: uuidv7() })
  id!: IEarlybirdDiscountSnapshot['id'];

  @Column('timestamptz')
  earlybirdStartDate!: IEarlybirdDiscountSnapshot['earlybirdStartDate'];

  @Column('timestamptz')
  earlybirdEndDate!: IEarlybirdDiscountSnapshot['earlybirdEndDate'];

  @Column('int')
  discountAmount!: IEarlybirdDiscountSnapshot['discountAmount'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IEarlybirdDiscountSnapshot['createdAt'];

  @Column()
  competitionId!: CompetitionEntity['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.earlybirdDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;
}
