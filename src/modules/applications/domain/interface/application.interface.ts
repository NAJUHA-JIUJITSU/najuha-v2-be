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
   * - 본인신청과 대리신청을 구별하는 type.
   * - SELF: 본인 신청
   * - PROXY: 대리 신청
   */
  type: 'SELF' | 'PROXY';

  /**
   * - status.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   * - DELETED: 삭제됨 (DB에는 남아있으나 유저에게 보여지지 않음)
   */
  status: 'READY' | 'DONE' | 'CANCELED' | 'DELETED';

  /** - competition id. */
  competitionId: ICompetition['id'];

  /** - user id. */
  userId: IUser['id'];

  /**
   * - player snapshots.
   * @minItems 1
   */
  playerSnapshots: IPlayerSnapshot[];

  /**
   * - participation division infos.
   * @minItems 1
   */
  participationDivisionInfos: IParticipationDivisionInfo[];
}

export namespace IApplication {
  export namespace ModelValue {
    export interface Base extends IApplication {}
    export interface Ready extends IApplication {}
    export interface Done extends IApplication {}
  }
}
