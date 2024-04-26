import { tags } from 'typia';
import { ICompetition } from './competition.interface';
import { IPriceSnapshot } from './price-snapshot.interface';

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
   * - ex) '-40', '-45', '-50', '+50', 'ABSOLUTE'.
   */
  weight: string & tags.MinLength<1> & tags.MaxLength<64>;

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
  createdAt: Date | (string & tags.Format<'date-time'>);

  /** UpdatedAt. */
  updatedAt: Date | (string & tags.Format<'date-time'>);

  /** CompetitionId. */
  competitionId: ICompetition['id'];

  /** 가격 스냅샷. */
  priceSnapshots: IPriceSnapshot[] & tags.MinItems<1>;
}
