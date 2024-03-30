import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PriceSnapshot } from '../competition/price-snapshot.entity';
import { ParticipationDivisionSnapshot } from './participation-division-snapshot.entity';
import { Application } from './application.entity';

@Entity('participation_divsion')
export class ParticipationDivision {
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
  applicationId: Application['id'];

  /** - applications. */
  @ManyToOne(() => Application, (application) => application.participationDivisions)
  @JoinColumn({ name: 'applicationId' })
  application: Application[];

  /** - payed price snapshot id. */
  @Column({ nullable: true })
  priceSnapshotId: PriceSnapshot['id'];

  /** - payed price snapshot. */
  @ManyToOne(() => PriceSnapshot, (priceSnapshot) => priceSnapshot.participationDivisions)
  @JoinColumn({ name: 'priceSnapshotId' })
  priceSnapshot: PriceSnapshot;

  /** - participation division snapshots. */
  @OneToMany(
    () => ParticipationDivisionSnapshot,
    (participationDivisionSnapshot) => participationDivisionSnapshot.participationDivision,
    { cascade: true },
  )
  participationDivisionSnapshots: ParticipationDivisionSnapshot[];

  // cancleId
  // cancle
}
