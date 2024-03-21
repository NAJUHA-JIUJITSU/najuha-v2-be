import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { PriceSnapshotEntity } from './price-snapshot.entity';
import { IDivision } from 'src/modules/competitions/structure/division.interface';

@Entity('division')
@Unique('UQ_DIVISION', ['category', 'uniform', 'gender', 'belt', 'weight', 'competitionId'])
export class DivisionEntity {
  /**
   * - division id.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: IDivision['id'];

  /**
   * - 부문 카테고리.
   * @minLength 1
   * @maxLength 64
   */
  @Column('varchar', { length: 64 })
  category: IDivision['category'];

  /**
   * - 유니폼 GI, NOGI
   */
  @Column('varchar', { length: 16 })
  uniform: IDivision['uniform'];

  /** - 성별. */
  @Column('varchar', { length: 16 })
  gender: IDivision['gender'];

  /**
   * - 주짓수벨트.
   * @minLength 1
   * @maxLength 64
   */
  @Column('varchar', { length: 64 })
  belt: IDivision['belt'];

  /**
   * - 체급.
   * @minLength 1
   * @maxLength 64
   */
  @Column('varchar', { length: 64 })
  weight: IDivision['weight'];

  /**
   * - 출생년도 범위 시작. YYYY.
   * @minLength 4
   * @tern ^[0-9]{4}$
   */
  @Column('varchar', { length: 4 })
  birthYearRangeStart: IDivision['birthYearRangeStart'];

  /**
   * - 출생년도 범위 끝. YYYY.
   * @minLength 4
   * @pattern ^[0-9]{4}$
   */
  @Column('varchar', { length: 4 })
  birthYearRangeEnd: IDivision['birthYearRangeEnd'];

  /**
   * - 활성 상태.
   * - ACTIVE: 해당 부문에 신청 가능. (USER 에게 노출됨.)
   * - INACTIVE: 해당 부문에 신청 불가능. (USER 에게 노출되지 않음.)
   */
  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status: IDivision['status'];

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  @CreateDateColumn()
  createdAt: IDivision['createdAt'];

  /**
   * - 엔티티가 수정될 때마다 업데이트되는 최종 업데이트 시간.
   */
  @UpdateDateColumn()
  updatedAt: IDivision['updatedAt'];

  /** - competitionId. */
  @Column({ name: 'competitionId' })
  competitionId: IDivision['competitionId'];

  /** - competition. */
  @ManyToOne(() => CompetitionEntity, (competition) => competition.divisions)
  competition?: CompetitionEntity;

  /** - price-snapshot. */
  @OneToMany(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.division, { cascade: true })
  priceSnapshots?: PriceSnapshotEntity[];

  //   /**
  //    * - 부문에 대한 신청 목록.
  //    * - OneToMany: Division(1) -> Application(*)
  //    */
  //   applications: ApplicationEntity[];
}
