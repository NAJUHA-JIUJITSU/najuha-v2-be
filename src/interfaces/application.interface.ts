import { IDivision } from './division.interface';

export interface IApplication {
  /**
   * - 신청 id.
   */
  id: number;

  playerName: string;

  playerGender: string;

  playerBirth: string;

  playerPhoneNumber: string;

  playerBelt: string;

  /**
   * - 신청 상태.
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

  /**
   * - division id.
   */
  divisionId: number;

  /**
   * - division 정보
   * - ManyToOne: Division(1) -> Application(*)
   * - JoinColumn: divisionId
   */
  division?: IDivision;
}
