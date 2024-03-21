import { ICompetition } from './competition.interface';
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
   * @tern ^[0-9]{4}$
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

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  createdAt: Date | string;

  /**
   * - 엔티티가 수정될 때마다 업데이트되는 최종 업데이트 시간.
   */
  updatedAt: Date | string;

  /** - competitionId. */
  competitionId: number;

  /** - competition. */
  competition?: ICompetition;

  /** - price-snapshot. */
  priceSnapshots?: IPriceSnapshot[];

  //   /**
  //    * - 부문에 대한 신청 목록.
  //    * - OneToMany: Division(1) -> Application(*)
  //    */
  //   applications: ApplicationEntity[];
}
