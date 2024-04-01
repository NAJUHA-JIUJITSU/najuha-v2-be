import { IPriceSnapshot } from './price-snapshot.interface';

export interface IDivision {
  /**
   * - division id.
   * @type uint32
   */
  id: number;

  /**
   * - 부문 카테고리.
   * @minLength 1
   * @maxLength 64
   */
  category: string;

  /**
   * - 유니폼 GI, NOGI
   */
  uniform: 'GI' | 'NOGI';

  /** - 성별. */
  gender: 'MALE' | 'FEMALE' | 'MIXED';

  /**
   * - 주짓수벨트.
   * @minLength 1
   * @maxLength 64
   */
  belt: string;

  /**
   * - 체급.
   * @minLength 1
   * @maxLength 64
   */
  weight: string;

  /**
   * - 출생년도 범위 시작. YYYY.
   * @minLength 4
   * @pattern ^[0-9]{4}$
   */
  birthYearRangeStart: string;

  /**
   * - 출생년도 범위 끝. YYYY.
   * @minLength 4
   * @pattern ^[0-9]{4}$
   */
  birthYearRangeEnd: string;

  /**
   * - 활성 상태.
   * - ACTIVE: 해당 부문에 신청 가능. (USER 에게 노출됨.)
   * - INACTIVE: 해당 부문에 신청 불가능. (USER 에게 노출되지 않음.)
   */
  status: 'ACTIVE' | 'INACTIVE';

  /** - created at. */
  createdAt: Date | string;

  /** - updated at. */
  updatedAt: Date | string;

  /** - competitionId. */
  competitionId: number;

  priceSnapshots: IPriceSnapshot[];
}
