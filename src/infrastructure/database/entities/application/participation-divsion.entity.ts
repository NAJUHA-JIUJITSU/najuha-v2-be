import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PriceSnapshotEntity } from '../competition/price-snapshot.entity';
import { ParticipationDivisionSnapshotEntity } from './participation-division-snapshot.entity';
import { ApplicationEntity } from './application.entity';
import { IParticipationDivision } from 'src/modules/applications/domain/interface/participation-division.interface';

@Entity('participation_divsion')
export class ParticipationDivisionEntity {
  @PrimaryGeneratedColumn()
  id: IParticipationDivision['id'];

  @CreateDateColumn()
  createdAt: IParticipationDivision['createdAt'];

  @Column()
  applicationId: ApplicationEntity['id'];

  @ManyToOne(() => ApplicationEntity, (application) => application.participationDivisions)
  @JoinColumn({ name: 'applicationId' })
  application: ApplicationEntity[];

  @Column({ nullable: true })
  priceSnapshotId: PriceSnapshotEntity['id'];

  @ManyToOne(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.participationDivisions)
  @JoinColumn({ name: 'priceSnapshotId' })
  priceSnapshot: PriceSnapshotEntity;

  @OneToMany(
    () => ParticipationDivisionSnapshotEntity,
    (participationDivisionSnapshot) => participationDivisionSnapshot.participationDivision,
    { cascade: true },
  )
  participationDivisionSnapshots: ParticipationDivisionSnapshotEntity[];

  // cancleId
  // cancle
}
