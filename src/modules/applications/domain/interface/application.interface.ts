import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPlayerSnapshot } from './player-snapshot.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';
import { tags } from 'typia';

export interface IApplication {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /**  Created at. */
  createdAt: Date | (string & tags.Format<'date-time'>);

  /** Updated at. */
  updatedAt: Date | (string & tags.Format<'date-time'>);

  /**
   * 본인신청과 대리신청을 구별하는 type.
   * - SELF: 본인 신청
   * - PROXY: 대리 신청
   */
  type: 'SELF' | 'PROXY';

  /**
   * Status.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   * - DELETED: 삭제됨 (DB에는 남아있으나 유저에게 보여지지 않음)
   */
  status: 'READY' | 'DONE' | 'CANCELED' | 'DELETED';

  /** Competition id. */
  competitionId: ICompetition['id'];

  /** User id. */
  userId: IUser['id'];

  /** Player snapshots. */
  playerSnapshots: IPlayerSnapshot[] & tags.MinItems<1>;

  /** Participation division infos. */
  participationDivisionInfos: IParticipationDivisionInfo[] & tags.MinItems<1>;
}
