import { ICompetition } from './competition.interface';

export interface IEarlybirdDiscountSnapshot {
  /**
   * - id.
   * @type uint32
   */
  id: number;

  /**
   * - 얼리버드 시작일
   */
  earlybirdStartDate: Date | string;

  /**
   * - 얼리버드 마감일
   */
  earlybirdEndDate: Date | string;

  /**
   * - 얼리버드 할인 가격 ex) 10000
   * - 단위 : 원
   * - 음수 값은 허용하지 않습니다.
   * @minimum 0
   */
  discountAmount: number;

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  createdAt: Date | string;

  /** - competition id. */
  competitionId: ICompetition['id'];
}
