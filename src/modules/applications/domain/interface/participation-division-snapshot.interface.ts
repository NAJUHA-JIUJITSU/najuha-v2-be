import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IParticipationDivision } from './participation-division.interface';

export interface IParticipationDivisionSnapshot {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

  /**
   * - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다.
   */
  createdAt: Date | string;

  /** - participation division id. */
  participationDivisionId: IParticipationDivision['id'];

  divisionId: IDivision['id'];
}
