import { IEarlyBirdDiscountStrategy } from './early-bird-discount-strategy.interface';

export interface IDivision {
  /**
   * - 부문 id.
   */
  id: number;

  /**
   * - 부문 카테고리.
   */
  category: string;

  /**
   * - 유니폼 GI, NOGI
   */
  uniform: string;

  /**
   * - 성별.
   */
  gender: string;

  /**
   * - 주짓수벨트.
   */
  belt: string;

  /**
   * - 체급.
   */
  weight: string;

  /**
   * - 출생년도 범위 시작.
   */
  birthYearRangeStart: number;

  /**
   * - 출생년도 범위 끝.
   */
  birthYearRangeEnd: number;

  /**
   * - 부문 가격
   */
  price: number;

  /**
   * - 활성 상태.
   */
  status: string;

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  createdAt: Date | string;

  /**
   * - 엔티티가 수정될 때마다 업데이트되는 최종 업데이트 시간.
   */
  updatedAt: Date | string;
}
