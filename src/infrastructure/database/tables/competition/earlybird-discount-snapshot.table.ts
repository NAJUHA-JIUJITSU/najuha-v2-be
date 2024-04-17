import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompetitionTable } from './competition.table';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';

@Entity('earlybird_discount_snapshot')
export class EarlybirdDiscountSnapshotTable {
  @Column('varchar', { length: 26, primary: true })
  id: IEarlybirdDiscountSnapshot['id'];

  @Column('timestamptz')
  earlybirdStartDate: IEarlybirdDiscountSnapshot['earlybirdStartDate'];

  @Column('timestamptz')
  earlybirdEndDate: IEarlybirdDiscountSnapshot['earlybirdEndDate'];

  @Column('int')
  discountAmount: IEarlybirdDiscountSnapshot['discountAmount'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: IEarlybirdDiscountSnapshot['createdAt'];

  @Column()
  competitionId: CompetitionTable['id'];

  @ManyToOne(() => CompetitionTable, (competition) => competition.earlybirdDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition: CompetitionTable;
}
