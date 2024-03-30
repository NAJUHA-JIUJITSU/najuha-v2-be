import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Division } from './division.entity';
import { EarlybirdDiscountSnapshot } from './earlybird-discount-snapshot.entity';
import { BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { CombinationDiscountSnapshot } from './combination-discount-snapshot.entity';
import { Application } from '../application/application.entity';
import { IExpectedPayment } from 'src/modules/applications/domain/expected-payment.interface';

@Entity('competition')
export class Competition {
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
  @OneToMany(() => EarlybirdDiscountSnapshot, (earlyBirdDiscountSnapshot) => earlyBirdDiscountSnapshot.competition)
  earlybirdDiscountSnapshots: EarlybirdDiscountSnapshot[];

  /** - 부문 조합 할인 전략. */
  @OneToMany(
    () => CombinationDiscountSnapshot,
    (combinationDiscountSnapshot) => combinationDiscountSnapshot.competition,
  )
  combinationDiscountSnapshots: CombinationDiscountSnapshot[];

  /**
   * - divisions.
   * - OneToMany: Competition(1) -> Division(*)
   */
  @OneToMany(() => Division, (division) => division.competition, { cascade: true })
  divisions: Division[];

  /**
   * - application.
   * - OneToMany: Competition(1) -> Application(*)
   */
  @OneToMany(() => Application, (application) => application.competition)
  applications: Application[];

  // mathod --------------------------------------------------------------------
  // updateStatus(status: Competition['status']): void {
  //   if (status === 'ACTIVE') {
  //     const missingProperties: string[] = [];
  //     if (this.title === 'DEFAULT TITLE') missingProperties.push('title');
  //     if (this.address === 'DEFAULT ADDRESS') missingProperties.push('address');
  //     if (this.competitionDate === null) missingProperties.push('competitionDate');
  //     if (this.registrationStartDate === null) missingProperties.push('registrationStartDate');
  //     if (this.registrationEndDate === null) missingProperties.push('registrationEndDate');
  //     if (this.description === 'DEFAULT DESCRIPTION') missingProperties.push('description');

  //     if (missingProperties.length > 0) {
  //       throw new BusinessException(
  //         CompetitionsErrorMap.COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE,
  //         `다음 항목을 작성해주세요: ${missingProperties.join(', ')}`,
  //       );
  //     }
  //   }
  //   this.status = status;
  // }

  // addDivisions(divisions: Division[]): void {
  //   const duplicatedDivisions = divisions.filter((division) => {
  //     return this.divisions.some(
  //       (existingDivision) =>
  //         existingDivision.category === division.category &&
  //         existingDivision.uniform === division.uniform &&
  //         existingDivision.gender === division.gender &&
  //         existingDivision.belt === division.belt &&
  //         existingDivision.weight === division.weight,
  //     );
  //   });
  //   if (duplicatedDivisions.length > 0) {
  //     throw new BusinessException(
  //       CompetitionsErrorMap.COMPETITIONS_DIVISION_DUPLICATED,
  //       `${duplicatedDivisions
  //         .map(
  //           (division) =>
  //             `${division.category} ${division.uniform} ${division.gender} ${division.belt} ${division.weight}`,
  //         )
  //         .join(', ')}`,
  //     );
  //   }
  //   this.divisions = [...this.divisions, ...divisions];
  // }

  validateExistDivisions(divisonIds: Division['id'][]): void {
    const notExistDivisions = divisonIds.filter((divisionId) => {
      return !this.divisions.some((division) => division.id === divisionId);
    });
    if (notExistDivisions.length > 0) {
      throw new BusinessException(
        CompetitionsErrorMap.COMPETITIONS_DIVISION_NOT_FOUND,
        `not found divisionIds: ${notExistDivisions.join(', ')}`,
      );
    }
  }

  calculateExpectedPayment(divisionIds: Division['id'][]): IExpectedPayment {
    const divisions = this.divisions.filter((division) => divisionIds.includes(division.id));
    const normalAmount = this.calculateNormalAmount(divisions);
    const earlybirdDiscountAmount = this.calculateEarlybirdDiscountAmount(
      this.earlybirdDiscountSnapshots[this.earlybirdDiscountSnapshots.length - 1] || null,
    );
    const combinationDiscountAmount = this.calculateCombinationDiscountAmount(
      this.combinationDiscountSnapshots[this.combinationDiscountSnapshots.length - 1] || null,
      divisions,
    );
    const totalAmount = normalAmount - earlybirdDiscountAmount - combinationDiscountAmount;
    return { normalAmount, earlybirdDiscountAmount, combinationDiscountAmount, totalAmount };
  }

  private calculateNormalAmount(divisions: Division[]): number {
    return divisions.reduce((acc, division) => {
      acc += division.priceSnapshots.at(-1)?.price || 0;
      return acc;
    }, 0);
  }

  private calculateEarlybirdDiscountAmount(
    earlybirdDiscountSnapshot: EarlybirdDiscountSnapshot,
    currentTime: Date = new Date(),
  ): number {
    if (earlybirdDiscountSnapshot === null) return 0;
    if (currentTime < earlybirdDiscountSnapshot.earlybirdStartDate) return 0;
    if (currentTime > earlybirdDiscountSnapshot.earlybirdEndDate) return 0;
    return earlybirdDiscountSnapshot.discountAmount;
  }

  private calculateCombinationDiscountAmount(
    combinationDiscountSnapshot: CombinationDiscountSnapshot,
    divisions: Division[],
  ): number {
    if (combinationDiscountSnapshot === null) return 0;
    const divisionUnits = divisions.map((division) => ({
      weight: division.weight === 'ABSOLUTE' ? 'ABSOLUTE' : 'WEIGHT',
      uniform: division.uniform,
    }));
    let maxDiscountAmount = 0;
    for (const rule of combinationDiscountSnapshot.combinationDiscountRules) {
      const matched = rule.combination.every((unit) =>
        divisionUnits.some(
          (divisionUnit) => divisionUnit.uniform === unit.uniform && divisionUnit.weight === unit.weight,
        ),
      );
      if (matched) maxDiscountAmount = Math.max(maxDiscountAmount, rule.discountAmount);
    }
    return maxDiscountAmount;
  }
}
