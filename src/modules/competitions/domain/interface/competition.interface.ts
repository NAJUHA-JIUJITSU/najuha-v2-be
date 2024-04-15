import { ICombinationDiscountSnapshot } from './combination-discount-snapshot.interface';
import { IDivision } from './division.interface';
import { IEarlybirdDiscountSnapshot } from './earlybird-discount-snapshot.interface';

export interface ICompetition {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

  /**
   * - 대회의 이름.
   * @minLength 1
   * @maxLength 256
   */
  title: string;

  /**
   * - 대회가 열리는 장소.
   * @minLength 1
   * @maxLength 256
   */
  address: string;

  /** - 대회 날짜. */
  competitionDate: null | string | Date;

  /** - 참가 신청 시작일 */
  registrationStartDate: null | string | Date;

  /** - 참가 신청 마감일. */
  registrationEndDate: null | string | Date;

  /** - 환불 가능 기간 마감일. */
  refundDeadlineDate: null | string | Date;

  /**
   * - 단독 참가자의 부문 조정 시작일.
   * - 부문에 참가자가 한 명만 있는 경우, 해당 참가자를 다른 체급이나 부문으로 조정할 수 있는 기간의 시작을 나타냅니다.
   */
  soloRegistrationAdjustmentStartDate: null | string | Date;

  /** - 단독 참가자의 부문 조정 마감일. */
  soloRegistrationAdjustmentEndDate: null | string | Date;

  /** - 참가자 명단 공개일. */
  registrationListOpenDate: null | string | Date;

  /** - 대진표 공개일. */
  bracketOpenDate: null | string | Date;

  /**
   * - 대회 상세 정보.
   * - 마크다운 형식으로 작성됩니다.
   * @minLength 1
   * @maxLength 10000
   */
  description: string;

  /** - 협약 대회 여부. */
  isPartnership: boolean;

  /**
   * - 조회수.
   * @type uint32
   */
  viewCount: number;

  /**
   * - 대회 포스터 이미지 URL Key.
   * @minLength 1
   * @maxLength 128
   */
  posterImgUrlKey: null | string;

  /**
   * - 대회의 상태
   * - ACTIVE: 활성화된 대회 유저에게 노출, 참가 신청 가능
   * - INACTIVE: 비활성화된 대회 유저에게 노출되지 않음, 참가 신청 불가능
   */
  status: 'ACTIVE' | 'INACTIVE';

  /** - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. */
  createdAt: string | Date;

  /** - 엔티티가 수정될 때마다 업데이트되는 최종 업데이트 시간. */
  updatedAt: string | Date;

  divisions: IDivision[];

  earlybirdDiscountSnapshots: IEarlybirdDiscountSnapshot[];

  combinationDiscountSnapshots: ICombinationDiscountSnapshot[];
}

export namespace ICompetition {
  export interface CreateDto extends ICompetition {}

  export namespace Read {
    export interface FindCompetitions extends Omit<ICompetition, 'combinationDiscountSnapshots' | 'divisions'> {}
  }
}
