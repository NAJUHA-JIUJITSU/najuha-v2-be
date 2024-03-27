import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ParticipationDivision } from './participation-divsion.entity';
import { Division } from '../../../competitions/domain/entities/division.entity';

@Entity('participation_divsion_snapshot')
export class ParticipationDivisionSnapshot {
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
  participationDivisionId: ParticipationDivision['id'];

  /** - participation division */
  @ManyToOne(
    () => ParticipationDivision,
    (participationDivision) => participationDivision.participationDivisionSnapshots,
  )
  @JoinColumn({ name: 'participationDivisionId' })
  participationDivision: ParticipationDivision;

  /** - division id. */
  @Column()
  divisionId: Division['id'];

  /** - division */
  @ManyToOne(() => Division, (division) => division.participationDivisionSnapshots)
  @JoinColumn({ name: 'divisionId' })
  division: Division;

  // cancleId
  // cancle
}
