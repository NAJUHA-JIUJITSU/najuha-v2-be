import { ICompetition } from './competition.interface';

export class IEarlybirdDiscountSnapshot {
  /**
   * - ID. 데이터베이스에서 자동 생성됩니다.
   * @type uint32
   */
  id: number;

  /**
   * - 얼리버드 시작일
   */
  earlyBirdStartDate: Date | string;

  /**
   * - 얼리버드 마감일
   */
  earlyBirdEndDate: Date | string;

  /**
   * - 얼리버드 할인 가격 ex) 10000
   * - 단위 : 원
   * - 음수 값은 허용하지 않습니다.
   * @minimum 0
   */
  discountPrice: number;

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  createdAt: Date | string;

  /** - 최종 업데이트 시간. 엔티티가 수정될 때마다 자동으로 업데이트됩니다. */
  updatedAt: Date | string;

  competition: ICompetition;
}
