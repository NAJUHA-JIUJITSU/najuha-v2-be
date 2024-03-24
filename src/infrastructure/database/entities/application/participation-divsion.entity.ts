import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationEntity } from '../application/application.entity';
import { PriceSnapshotEntity } from '../competition/price-snapshot.entity';
import { ParticipationDivisionSnapshotEntity } from './participation-division-snapshot.entity';

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
  application?: ApplicationEntity[];

  /** - payed price snapshot id. */
  @Column()
  priceSnapshotId: PriceSnapshotEntity['id'];

  /** - payed price snapshot. */
  @ManyToOne(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.participationDivisions)
  @JoinColumn({ name: 'priceSnapshotId' })
  priceSnapshot?: PriceSnapshotEntity;

  /** - participation division snapshots. */
  @ManyToOne(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.participationDivisions)
  participationDivisionSnapshots?: ParticipationDivisionSnapshotEntity[];

  // cancleId
  // cancle
}
