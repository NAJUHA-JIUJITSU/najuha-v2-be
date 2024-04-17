import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPlayerSnapshot } from './player-snapshot.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';

export interface IApplication {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

  /**  - created at. */
  createdAt: Date | string;

  /** - updated at. */
  updatedAt: Date | string;

  /**
   * - type.
   * - SELF: 본인 신청
   * - PROXY: 대리 신청
   */
  type: 'SELF' | 'PROXY';

  /**
   * - status.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   */
  status: 'READY' | 'DONE' | 'CANCELED';

  /** - competition id. */
  competitionId: ICompetition['id'];

  /** - user id. */
  userId: IUser['id'];

  playerSnapshots: IPlayerSnapshot[];

  participationDivisionInfos: IParticipationDivisionInfo[];
}

export namespace IApplication {
  export interface EntityData extends Omit<IApplication, 'playerSnapshots' | 'participationDivisionInfos'> {
    playerSnapshots?: IPlayerSnapshot[];
    participationDivisionInfos?: IParticipationDivisionInfo[];
  }
}
