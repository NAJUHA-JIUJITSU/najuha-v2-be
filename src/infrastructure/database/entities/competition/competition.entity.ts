import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { DivisionEntity } from './division.entity';
import { EarlybirdDiscountSnapshotEntity } from './early-bird-discount-snapshot.entity';
import { BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { CombinationDiscountSnapshotEntity } from './combination-discount-snapshot.entity';
import { ApplicationEntity } from '../application/application.entity';

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
  @Column('timestamp', { nullable: true })
  competitionDate: null | string | Date;

  /** - 참가 신청 시작일 */
  @Column('timestamp', { nullable: true })
  registrationStartDate: null | string | Date;

  /** - 참가 신청 마감일. */
  @Column('timestamp', { nullable: true })
  registrationEndDate: null | string | Date;

  /** - 환불 가능 기간 마감일. */
  @Column('timestamp', { nullable: true })
  refundDeadlineDate: null | string | Date;

  /**
   * - 단독 참가자의 부문 조정 시작일.
   * - 부문에 참가자가 한 명만 있는 경우, 해당 참가자를 다른 체급이나 부문으로 조정할 수 있는 기간의 시작을 나타냅니다.
   */
  @Column('timestamp', { nullable: true })
  soloRegistrationAdjustmentStartDate: null | string | Date;

  /** - 단독 참가자의 부문 조정 마감일. */
  @Column('timestamp', { nullable: true })
  soloRegistrationAdjustmentEndDate: null | string | Date;

  /** - 참가자 명단 공개일. */
  @Column('timestamp', { nullable: true })
  registrationListOpenDate: null | string | Date;

  /** - 대진표 공개일. */
  @Column('timestamp', { nullable: true })
  bracketOpenDate: null | string | Date;

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
  createdAt: string | Date;

  /** - 엔티티가 수정될 때마다 업데이트되는 최종 업데이트 시간. */
  @UpdateDateColumn()
  updatedAt: string | Date;

  /** - 대회의 얼리버드 할인 전략. */
  @OneToMany(
    () => EarlybirdDiscountSnapshotEntity,
    (earlyBirdDiscountSnapshot) => earlyBirdDiscountSnapshot.competition,
  )
  earlybirdDiscountSnapshots?: EarlybirdDiscountSnapshotEntity[];

  /** - 부문 조합 할인 전략. */
  @OneToMany(
    () => CombinationDiscountSnapshotEntity,
    (combinationDiscountSnapshot) => combinationDiscountSnapshot.competition,
  )
  combinationDiscountSnapshots?: CombinationDiscountSnapshotEntity[];

  /**
   * - divisions.
   * - OneToMany: Competition(1) -> Division(*)
   */
  @OneToMany(() => DivisionEntity, (division) => division.competition)
  divisions?: DivisionEntity[];

  /**
   * - application.
   * - OneToMany: Competition(1) -> Application(*)
   */
  @OneToMany(() => ApplicationEntity, (application) => application.competition)
  applications?: ApplicationEntity[];

  // mathod --------------------------------------------------------------------
  updateStatus(status: CompetitionEntity['status']): void {
    if (status === 'ACTIVE') {
      const missingProperties: string[] = [];
      if (this.title === 'DEFAULT TITLE') missingProperties.push('title');
      if (this.address === 'DEFAULT ADDRESS') missingProperties.push('address');
      if (this.competitionDate === null) missingProperties.push('competitionDate');
      if (this.registrationStartDate === null) missingProperties.push('registrationStartDate');
      if (this.registrationEndDate === null) missingProperties.push('registrationEndDate');
      if (this.description === 'DEFAULT DESCRIPTION') missingProperties.push('description');

      if (missingProperties.length > 0) {
        throw new BusinessException(
          CompetitionsErrorMap.COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE,
          `다음 항목을 작성해주세요: ${missingProperties.join(', ')}`,
        );
      }
    }
    this.status = status;
  }
}
