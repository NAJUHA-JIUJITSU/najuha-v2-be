import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ParticipationDivisionEntity } from './participation-divsion.entity';
import { DivisionEntity } from '../competition/division.entity';

@Entity('participation_divsion_snapshot')
export class ParticipationDivisionSnapshotEntity {
  /**
   * - participation division id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - participation division id. */
  @Column()
  participationDivisionId: ParticipationDivisionEntity['id'];

  /** - participation division */
  @ManyToOne(
    () => ParticipationDivisionEntity,
    (participationDivision) => participationDivision.participationDivisionSnapshots,
  )
  @JoinColumn({ name: 'participationDivisionId' })
  participationDivision?: ParticipationDivisionEntity;

  /** - division id. */
  @Column()
  divisionId: DivisionEntity['id'];

  /** - division */
  @ManyToOne(() => DivisionEntity, (division) => division.participationDivisionSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division: DivisionEntity;

  // cancleId
  // cancle
}
