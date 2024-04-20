import { tags } from 'typia';
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
  export namespace ModelValue {
    // base
    // active
    // inactive
  }

  export interface CreateDto
    extends Partial<
      Omit<
        ICompetition,
        | 'id'
        | 'status'
        | 'viewCount'
        | 'createdAt'
        | 'updatedAt'
        | 'divisions'
        | 'earlybirdDiscountSnapshots'
        | 'combinationDiscountSnapshots'
      >
    > {}

  export interface UpdateDto
    extends Pick<ICompetition, 'id'>,
      Partial<
        Omit<
          ICompetition,
          | 'id'
          | 'status'
          | 'viewCount'
          | 'createdAt'
          | 'updatedAt'
          | 'divisions'
          | 'earlybirdDiscountSnapshots'
          | 'combinationDiscountSnapshots'
        >
      > {}

  export namespace QueryOptions {
    /** - 현제 페이지 번호입니다. 최초 요청 시에는 0을 사용합니다. */
    export type Page = number;

    /** - 한 페이지에 보여줄 아이템의 수입니다. default: 10 */
    export type Limit = number;

    /** - 날짜 필터. YYYY-MM 형식입니다. */
    export type DateFilter = string & tags.Pattern<'^[0-9]{4}-[0-9]{2}$'>;

    /** - YYYY-MM 형식의 날짜 필터를 Date로 파싱한 결과입니다. */
    export type parsedDateFilter = Date;

    /** - 대회가 열리는 위치로 필터링합니다. */
    export type LocationFilter =
      | '서울'
      | '부산'
      | '인천'
      | '대구'
      | '대전'
      | '광주'
      | '울산'
      | '세종'
      | '경기'
      | '충북'
      | '충남'
      | '전남'
      | '경북'
      | '경남'
      | '강원'
      | '전북'
      | '제주';

    /**
     * - 태그를 기준으로 필터링합니다. 중복 선택 가능합니다
     * - 간편결제: 간편결제 가능한 대회 (협약 대회)
     * - 얼리버드: 얼리버드 할인 기간 중인 대회
     * - 신청가능: 참가 신청 가능한 대회
     * - 단독출전조정: 단독 참가자의 부문 조정 기간 중인 대회
     */
    export type SelectFilter = '간편결제' | '얼리버드' | '신청가능' | '단독출전조정';

    /**
     * - 대회를 정렬하는 옵션입니다.
     * - 일자순: 대회 날짜 순으로 정렬
     * - 조회순: 조회수 순으로 정렬
     * - 마감임박순: 참가 신청 마감일이 가까운 순으로 정렬
     */
    export type SortOption = '일자순' | '조회순' | '마감임박순';
  }

  // export interface FindOneRet extends

  export interface FindManyRet extends Omit<ICompetition, 'combinationDiscountSnapshots' | 'divisions'> {}
}
