import { tags } from 'typia';
import { ICompetition } from './competition.interface';
import { IPriceSnapshot, IPriceSnapshotModelData } from './price-snapshot.interface';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
/**
 * Division.
 *
 * - 대회의 부문 정보.
 * - 대회의 부문의 가격 정보는 PriceSnapshot Entity를 통해 관리합니다.
 * - 가격이 수정될때마다 PriceSnapshot Entity에 스냅샷을 생성합니다.
 */
export interface IDivision {
  /** UUID v7. */
  id: TId;

  /**
   * 부문 카테고리.
   * - ex) '초등부', '중등부', '어덜트'.
   */
  category: string & tags.MinLength<1> & tags.MaxLength<64>;

  /** 유니폼. */
  uniform: 'GI' | 'NOGI';

  /** 부문 성별. */
  gender: 'MALE' | 'FEMALE' | 'MIXED';

  /**
   * 주짓수벨트.
   * - ex) '화이트', '블루', '퍼플', '브라운', '블랙'.
   */
  belt: string & tags.MinLength<1> & tags.MaxLength<64>;

  /**
   * 체급.
   * - weight type: '-45', '+45', '-60.5', '+60.5'
   * - absolute type: '-45_ABSOLUTE', '+45_ABSOLUTE', '-60.5_ABSOLUTE', '+60.5_ABSOLUTE', 'ABSOLUTE'
   */
  weight: Weight | Absolute;

  /** 출생년도 범위 시작. YYYY. */
  birthYearRangeStart: string & tags.MinLength<4> & tags.Pattern<'^[0-9]{4}$'>;

  /** 출생년도 범위 끝. YYYY. */
  birthYearRangeEnd: string & tags.MinLength<4> & tags.Pattern<'^[0-9]{4}$'>;

  /**
   * 활성 상태.
   * - ACTIVE: 해당 부문에 신청 가능. (USER 에게 노출됨.)
   * - INACTIVE: 해당 부문에 신청 불가능. (USER 에게 노출되지 않음.)
   */
  status: TDivisionStatus;

  /** createdAt. */
  createdAt: TDateOrStringDate;

  updatedAt: TDateOrStringDate;

  /** CompetitionId. */
  competitionId: ICompetition['id'];

  /** 가격 스냅샷. */
  priceSnapshots: IPriceSnapshot[] & tags.MinItems<1>;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IDivisionModelData {
  id: IDivision['id'];
  category: IDivision['category'];
  uniform: IDivision['uniform'];
  gender: IDivision['gender'];
  belt: IDivision['belt'];
  weight: IDivision['weight'];
  birthYearRangeStart: IDivision['birthYearRangeStart'];
  birthYearRangeEnd: IDivision['birthYearRangeEnd'];
  status: IDivision['status'];
  createdAt: IDivision['createdAt'];
  updatedAt: IDivision['updatedAt'];
  competitionId: IDivision['competitionId'];
  priceSnapshots: IPriceSnapshotModelData[];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IDivisionCreateDto
  extends Pick<
    IDivision,
    | 'category'
    | 'uniform'
    | 'gender'
    | 'belt'
    | 'weight'
    | 'birthYearRangeStart'
    | 'birthYearRangeEnd'
    | 'competitionId'
  > {}

// ----------------------------------------------------------------------------
// Custom Types
// ----------------------------------------------------------------------------
/**
 * 일반 체급 타입.
 * - ex) '-45', '+45', '-60.5', '+60.5'
 */
export type Weight = string & tags.Pattern<'^[-+]\\d{1,3}(\\.\\d{1,2})?$'>;

/**
 * 앱솔루트 체급 타입.
 * - ex) '-45_ABSOLUTE', '+45_ABSOLUTE', '-60.5_ABSOLUTE', '+60.5_ABSOLUTE', 'ABSOLUTE'
 */
export type Absolute = string & tags.Pattern<'^[-+]\\d{1,3}(\\.\\d{1,2})?_ABSOLUTE$|^ABSOLUTE$'>;

// ----------------------------------------------------------------------------
// ENUM
// ----------------------------------------------------------------------------
export type TDivisionStatus = 'ACTIVE' | 'INACTIVE';
