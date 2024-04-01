import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PriceSnapshotEntity } from '../competition/price-snapshot.entity';
import { ParticipationDivisionSnapshotEntity } from './participation-division-snapshot.entity';
import { ApplicationEntity } from './application.entity';

@Entity('participation_divsion')
export class ParticipationDivisionEntity {
  /**
   * - participation division id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /** - created at. */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - application id. */
  @Column()
  applicationId: ApplicationEntity['id'];

  /** - applications. */
  @ManyToOne(() => ApplicationEntity, (application) => application.participationDivisions)
  @JoinColumn({ name: 'applicationId' })
  application: ApplicationEntity[];

  /** - payed price snapshot id. */
  @Column({ nullable: true })
  priceSnapshotId: PriceSnapshotEntity['id'];

  /** - payed price snapshot. */
  @ManyToOne(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.participationDivisions)
  @JoinColumn({ name: 'priceSnapshotId' })
  priceSnapshot: PriceSnapshotEntity;

  /** - participation division snapshots. */
  @OneToMany(
    () => ParticipationDivisionSnapshotEntity,
    (participationDivisionSnapshot) => participationDivisionSnapshot.participationDivision,
    { cascade: true },
  )
  participationDivisionSnapshots: ParticipationDivisionSnapshotEntity[];

  // cancleId
  // cancle
}
