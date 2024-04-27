import { tags } from 'typia';
import { ICombinationDiscountSnapshot } from './combination-discount-snapshot.interface';
import { IDivision } from './division.interface';
import { IEarlybirdDiscountSnapshot } from './earlybird-discount-snapshot.interface';

export interface ICompetition {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** 대회명. */
  title: string & tags.MinLength<1> & tags.MaxLength<256>;

  /** 대회가 열리는 위치 (도로명 주소).*/
  address: string & tags.MinLength<1> & tags.MaxLength<256>;

  /** - 대회 날짜. */
  competitionDate: null | Date | (string & tags.Format<'date-time'>);

  /** - 참가 신청 시작일 */
  registrationStartDate: null | Date | (string & tags.Format<'date-time'>);

  /** - 참가 신청 마감일. */
  registrationEndDate: null | Date | (string & tags.Format<'date-time'>);

  /** - 환불 가능 기간 마감일. */
  refundDeadlineDate: null | Date | (string & tags.Format<'date-time'>);

  /**
   * 단독 참가자의 부문 조정 시작일.
   * - 부문에 참가자가 한 명만 있는 경우, 해당 참가자를 다른 체급이나 부문으로 조정할 수 있는 기간의 시작을 나타냅니다.
   */
  soloRegistrationAdjustmentStartDate: null | Date | (string & tags.Format<'date-time'>);

  /** - 단독 참가자의 부문 조정 마감일. */
  soloRegistrationAdjustmentEndDate: null | Date | (string & tags.Format<'date-time'>);

  /** - 참가자 명단 공개일. */
  registrationListOpenDate: null | Date | (string & tags.Format<'date-time'>);

  /** - 대진표 공개일. */
  bracketOpenDate: null | Date | (string & tags.Format<'date-time'>);

  /** 대회 상세 정보. */
  description: string & tags.MinLength<1> & tags.MaxLength<10000>;

  /** - 협약 대회 여부. */
  isPartnership: boolean;

  /** 조회수. */
  viewCount: number & tags.Type<'uint32'>;

  /** 대회 포스터 이미지 URL Key. */
  posterImgUrlKey: null | (string & tags.MinLength<1> & tags.MaxLength<128>);

  /**
   * 대회의 상태.
   * - ACTIVE: 활성화된 대회 유저에게 노출, 참가 신청 가능.
   * - INACTIVE: 비활성화된 대회 유저에게 노출되지 않음, 참가 신청 불가능.
   */
  status: 'ACTIVE' | 'INACTIVE';

  /** CreatedAt. */
  createdAt: Date | (string & tags.Format<'date-time'>);

  /** UpdatedAt. */
  updatedAt: Date | (string & tags.Format<'date-time'>);

  /** 대회 부문 정보. */
  divisions: IDivision[];

  /**
   * 얼리버드 할인 정보.
   * - 배열의 길이가 0이면 얼리버드 할인이 없는 대회입니다.
   * - 배열의 마지막 요소가 현재 적용중인 얼리버드 할인 정보입니다.
   */
  earlybirdDiscountSnapshots: IEarlybirdDiscountSnapshot[];

  /**
   * 조합 할인 정보.
   * - 배열의 길이가 0이면 조합 할인이 없는 대회입니다.
   * - 배열의 마지막 요소가 현재 적용중인 조합 할인 정보입니다.
   */
  combinationDiscountSnapshots: ICombinationDiscountSnapshot[];
}

export interface ICompetitionCreateDto
  extends Partial<
    Pick<
      ICompetition,
      | 'title'
      | 'address'
      | 'competitionDate'
      | 'registrationStartDate'
      | 'registrationEndDate'
      | 'refundDeadlineDate'
      | 'soloRegistrationAdjustmentStartDate'
      | 'soloRegistrationAdjustmentEndDate'
      | 'registrationListOpenDate'
      | 'bracketOpenDate'
      | 'description'
      | 'isPartnership'
    >
  > {}

export interface ICompetitionUpdateDto
  extends Partial<
    Pick<
      ICompetition,
      | 'id'
      | 'title'
      | 'address'
      | 'competitionDate'
      | 'registrationStartDate'
      | 'registrationEndDate'
      | 'refundDeadlineDate'
      | 'soloRegistrationAdjustmentStartDate'
      | 'soloRegistrationAdjustmentEndDate'
      | 'registrationListOpenDate'
      | 'bracketOpenDate'
      | 'description'
      | 'isPartnership'
    >
  > {}

export interface ICompetitionQueryOptions {
  /** - 현제 페이지 번호입니다. default: 0 */
  page: number;

  /** - 한 페이지에 보여줄 아이템의 수입니다. default: 10 */
  limit: number;

  /** - YYYY-MM 형식의 날짜 필터를 Date로 파싱한 결과입니다. default: Now */
  parsedDateFilter: Date;

  /**
   * - 대회를 정렬하는 옵션입니다. default: '일자순'
   * - 일자순: 대회 날짜 순으로 정렬
   * - 조회순: 조회수 순으로 정렬
   * - 마감임박순: 참가 신청 마감일이 가까운 순으로 정렬
   */
  sortOption: '일자순' | '조회순' | '마감임박순';

  /** - 대회가 열리는 위치로 필터링합니다. */
  locationFilter?:
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
  selectFilter?: ('간편결제' | '얼리버드' | '신청가능' | '단독출전조정')[];

  /** - 대회 상태. */
  status?: ICompetition['status'];
}