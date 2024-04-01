import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { ApplicationEntity } from 'src/infrastructure/database/entities/application/application.entity';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/structure/earlybird-discount-snapshot.interface';

@Entity('early_bird_discount_snapshot')
export class EarlybirdDiscountSnapshotEntity {
  @PrimaryGeneratedColumn()
  id: IEarlybirdDiscountSnapshot['id'];

  @Column('timestamp')
  earlybirdStartDate: IEarlybirdDiscountSnapshot['earlybirdStartDate'];

  @Column('timestamp')
  earlybirdEndDate: IEarlybirdDiscountSnapshot['earlybirdEndDate'];

  @Column('int')
  discountAmount: IEarlybirdDiscountSnapshot['discountAmount'];

  @CreateDateColumn()
  createdAt: IEarlybirdDiscountSnapshot['createdAt'];

  @Column()
  competitionId: CompetitionEntity['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.earlybirdDiscountSnapshots)
  @JoinColumn({ name: 'competitionId' })
  competition: CompetitionEntity;

  @OneToMany(() => ApplicationEntity, (application) => application.earlybirdDiscountSnapshot)
  applications: ApplicationEntity[];
}
