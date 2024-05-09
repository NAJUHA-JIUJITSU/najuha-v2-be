import { tags } from 'typia';
import { ICompetition } from './competition.interface';
import { IPriceSnapshot } from './price-snapshot.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface IDivision {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

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
  weight: WeightType | AbsoluteType;

  /** 출생년도 범위 시작. YYYY. */
  birthYearRangeStart: string & tags.MinLength<4> & tags.Pattern<'^[0-9]{4}$'>;

  /** 출생년도 범위 끝. YYYY. */
  birthYearRangeEnd: string & tags.MinLength<4> & tags.Pattern<'^[0-9]{4}$'>;

  /**
   * 활성 상태.
   * - ACTIVE: 해당 부문에 신청 가능. (USER 에게 노출됨.)
   * - INACTIVE: 해당 부문에 신청 불가능. (USER 에게 노출되지 않음.)
   */
  status: 'ACTIVE' | 'INACTIVE';

  /** CreatedAt. */
  createdAt: DateOrStringDate;

  /** UpdatedAt. */
  updatedAt: DateOrStringDate;

  /** CompetitionId. */
  competitionId: ICompetition['id'];

  /** 가격 스냅샷. */
  priceSnapshots: IPriceSnapshot[] & tags.MinItems<1>;
}

/**
 * 일반 체급 타입.
 * - ex) '-45', '+45', '-60.5', '+60.5'
 */
type WeightType = string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[-+]\\d+(\\.\\d+)?$'>;

/**
 * 앱솔루트 체급 타입.
 * - ex) '-45_ABSOLUTE', '+45_ABSOLUTE', '-60.5_ABSOLUTE', '+60.5_ABSOLUTE', 'ABSOLUTE'
 */
type AbsoluteType = string &
  tags.MinLength<1> &
  tags.MaxLength<64> &
  tags.Pattern<'^[-+]\\d+(\\.\\d+)?_ABSOLUTE$|ABSOLUTE$'>;
