import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { PriceSnapshotEntity } from './price-snapshot.entity';
import { ParticipationDivisionSnapshotEntity } from '../application/participation-division-snapshot.entity';

@Entity('division')
@Unique('UQ_DIVISION', ['category', 'uniform', 'gender', 'belt', 'weight', 'competitionId'])
export class DivisionEntity {
  /**
   * - division id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 부문 카테고리.
   * @minLength 1
   * @maxLength 64
   */
  @Column('varchar', { length: 64 })
  category: string;

  /**
   * - 유니폼 GI, NOGI
   */
  @Column('varchar', { length: 16 })
  uniform: 'GI' | 'NOGI';

  /** - 성별. */
  @Column('varchar', { length: 16 })
  gender: 'MALE' | 'FEMALE' | 'MIXED';

  /**
   * - 주짓수벨트.
   * @minLength 1
   * @maxLength 64
   */
  @Column('varchar', { length: 64 })
  belt: string;

  /**
   * - 체급.
   * @minLength 1
   * @maxLength 64
   */
  @Column('varchar', { length: 64 })
  weight: string;

  /**
   * - 출생년도 범위 시작. YYYY.
   * @minLength 4
   * @tern ^[0-9]{4}$
   */
  @Column('varchar', { length: 4 })
  birthYearRangeStart: string;

  /**
   * - 출생년도 범위 끝. YYYY.
   * @minLength 4
   * @pattern ^[0-9]{4}$
   */
  @Column('varchar', { length: 4 })
  birthYearRangeEnd: string;

  /**
   * - 활성 상태.
   * - ACTIVE: 해당 부문에 신청 가능. (USER 에게 노출됨.)
   * - INACTIVE: 해당 부문에 신청 불가능. (USER 에게 노출되지 않음.)
   */
  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  /** - created at. */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - updated at. */
  @UpdateDateColumn()
  updatedAt: Date | string;

  /** - competitionId. */
  @Column()
  competitionId: number;

  /** - competition. */
  @ManyToOne(() => CompetitionEntity, (competition) => competition.divisions)
  @JoinColumn({ name: 'competitionId' })
  competition?: CompetitionEntity;

  /** - price snapshots. */
  @OneToMany(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.division, { cascade: true })
  priceSnapshots?: PriceSnapshotEntity[];

  /** - participation division snapshots. */
  @OneToMany(
    () => ParticipationDivisionSnapshotEntity,
    (participationDivisionSnapshot) => participationDivisionSnapshot.division,
  )
  participationDivisionSnapshots?: ParticipationDivisionSnapshotEntity[];

  // methods ------------------------------------------------------------------
  constructor(partial: Partial<DivisionEntity>) {
    Object.assign(this, partial);
  }
}
