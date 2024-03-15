import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EarlyBirdDiscountStrategyEntity } from './early-bird-discount-strategy.entity';

@Entity('competition')
export class CompetitionEntity {
  /**
   * - 대회의 고유 식별자. 데이터베이스에서 자동으로 생성됩니다.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * - 대회의 이름.
   * @minLength 1
   * @maxLength 256
   */
  @Column('varchar', { length: 256, default: 'DEFAULT TITLE' })
  title: string;

  /**
   * - 대회가 열리는 장소.
   * @minLength 1
   * @maxLength 256
   */
  @Column('varchar', { length: 256, default: 'DEFAULT ADDRESS' })
  address: string;

  /** - 대회 날짜. */
  @Column('date', { nullable: true })
  competitionDate: null | Date | string;

  /** - 참가 신청 시작일 */
  @Column('date', { nullable: true })
  registrationStartDate: null | Date | string;

  /** - 참가 신청 마감일. */
  @Column('date', { nullable: true })
  registrationEndDate: null | Date | string;

  /** - 환불 가능 기간 마감일. */
  @Column('date', { nullable: true })
  refundDeadlineDate: null | Date | string;

  /**
   * - 단독 참가자의 부문 조정 시작일.
   * - 부문에 참가자가 한 명만 있는 경우, 해당 참가자를 다른 체급이나 부문으로 조정할 수 있는 기간의 시작을 나타냅니다.
   */
  @Column('date', { nullable: true })
  soloRegistrationAdjustmentStartDate: null | Date | string;

  /** - 단독 참가자의 부문 조정 마감일. */
  @Column('date', { nullable: true })
  soloRegistrationAdjustmentEndDate: null | Date | string;

  /** - 참가자 명단 공개일. */
  @Column('date', { nullable: true })
  registrationListOpenDate: null | Date | string;

  /** - 대진표 공개일. */
  @Column('date', { nullable: true })
  bracketOpenDate: null | Date | string;

  /**
   * - 대회 상세 정보.
   * - 마크다운 형식으로 작성됩니다.
   * @minLength 1
   * @maxLength 10000
   */
  @Column('text', { default: 'DEFAULT DESCRIPTION' })
  description: string;

  /** - 협약 대회 여부. */
  @Column('boolean', { default: false })
  isPartnership: boolean;

  /**
   * - 조회수.
   * @type uint32
   */
  @Column('int', { default: 0 })
  viewCount: number;

  /**
   * - 대회 포스터 이미지 URL Key.
   * @minLength 1
   * @maxLength 128
   */
  @Column('varchar', { length: 256, nullable: true })
  posterImgUrlKey: null | string;

  /**
   * - 대회의 상태
   * - ACTIVE: 활성화된 대회 유저에게 노출, 참가 신청 가능
   * - INACTIVE: 비활성화된 대회 유저에게 노출되지 않음, 참가 신청 불가능
   */
  @Column('varchar', { length: 16, default: 'INACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  /** - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. */
  @CreateDateColumn()
  createdAt: Date | string;

  /** - 엔티티가 수정될 때마다 업데이트되는 최종 업데이트 시간. */
  @UpdateDateColumn()
  updatedAt: Date | string;

  /**
   * - 대회의 얼리버드 할인 전략.
   * - OneToOne: Competition(1) -> EarlyBirdDiscountStrategy(1)
   * - JoinColumn: competitionId
   */
  @OneToOne(() => EarlyBirdDiscountStrategyEntity, (earlyBirdDiscountStrategy) => earlyBirdDiscountStrategy.competition)
  @JoinColumn()
  earlyBirdDiscountStrategy?: EarlyBirdDiscountStrategyEntity;
}
