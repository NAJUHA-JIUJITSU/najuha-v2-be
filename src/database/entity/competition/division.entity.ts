import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { PriceSnapshotEntity } from './price-snapshot.entity';
import { ParticipationDivisionInfoSnapshotEntity } from '../application/participation-division-info-snapshot.entity';
import { IDivision } from '../../../modules/competitions/domain/interface/division.interface';
import { uuidv7 } from 'uuidv7';
import { ParticipationDivisionInfoPaymentEntity } from '../application/participation-division-info-payment.entity';

/**
 * Division.
 *
 * - 대회의 부문 정보.
 * - 대회의 부문의 가격 정보는 PriceSnapshot Entity를 통해 관리합니다.
 * - 가격이 수정될때마다 PriceSnapshot Entity에 스냅샷을 생성합니다.
 * @namespace Competition
 * @erd Application
 */
@Entity('division')
@Unique('UQ_DIVISION', ['category', 'uniform', 'gender', 'belt', 'weight', 'competitionId'])
@Index('IDX_Division_competitionId', ['competitionId'])
export class DivisionEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: IDivision['id'];

  /**
   * 부문 카테고리.
   * - ex) '초등부', '중등부', '어덜트'.
   */
  @Column('varchar', { length: 64 })
  category!: IDivision['category'];

  /** 유니폼. */
  @Column('varchar', { length: 16 })
  uniform!: IDivision['uniform'];

  /** 부문 성별. */
  @Column('varchar', { length: 16 })
  gender!: IDivision['gender'];

  /**
   * 주짓수벨트.
   * - ex) '화이트', '블루', '퍼플', '브라운', '블랙'.
   */
  @Column('varchar', { length: 64 })
  belt!: IDivision['belt'];

  /**
   * 체급.
   * - weight type: '-45', '+45', '-60.5', '+60.5'
   * - absolute type: '-45_ABSOLUTE', '+45_ABSOLUTE', '-60.5_ABSOLUTE', '+60.5_ABSOLUTE', 'ABSOLUTE'
   */
  @Column('varchar', { length: 64 })
  weight!: IDivision['weight'];

  /** 출생년도 범위 시작. YYYY. */
  @Column('varchar', { length: 4 })
  birthYearRangeStart!: IDivision['birthYearRangeStart'];

  /** 출생년도 범위 끝. YYYY. */
  @Column('varchar', { length: 4 })
  birthYearRangeEnd!: IDivision['birthYearRangeEnd'];

  /**
   * 활성 상태.
   * - ACTIVE: 해당 부문에 신청 가능. (USER 에게 노출됨.)
   * - INACTIVE: 해당 부문에 신청 불가능. (USER 에게 노출되지 않음.)
   */
  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status!: IDivision['status'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: IDivision['createdAt'];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: IDivision['updatedAt'];

  @Column('uuid')
  competitionId!: CompetitionEntity['id'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.divisions)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;

  /**
   * @minitems 1
   */
  @OneToMany(() => PriceSnapshotEntity, (priceSnapshot) => priceSnapshot.division, { cascade: true, eager: true })
  priceSnapshots!: PriceSnapshotEntity[];

  @OneToMany(
    () => ParticipationDivisionInfoSnapshotEntity,
    (participationDivisionInfoSnapshot) => participationDivisionInfoSnapshot.division,
  )
  participationDivisionInfoSnapshots!: ParticipationDivisionInfoSnapshotEntity[];

  @OneToMany(
    () => ParticipationDivisionInfoPaymentEntity,
    (participationDivisionInfoPayment) => participationDivisionInfoPayment.division,
  )
  participationDivisionInfoPayments!: ParticipationDivisionInfoPaymentEntity[];
}
