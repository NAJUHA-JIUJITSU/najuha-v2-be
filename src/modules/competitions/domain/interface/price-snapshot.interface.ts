import { IDivision } from './division.interface';

export interface IPriceSnapshot {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

  /**
   * - price, 단위: 원.
   * @type uint32
   * @minimum 0
   */
  price: number;

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  createdAt: Date | string;

  /** - division id. */
  divisionId: IDivision['id'];
}
