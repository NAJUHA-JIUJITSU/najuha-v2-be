import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPlayerSnapshot, IPlayerSnapshotCreateDto } from './player-snapshot.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';
import { tags } from 'typia';
import { IAdditionalInfo } from './additional-info.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface IApplication {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /**  Created at. */
  createdAt: DateOrStringDate;

  /** Updated at. */
  updatedAt: DateOrStringDate;

  /** Deleted at. */
  deletedAt: DateOrStringDate | null;

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
   */
  status: 'READY' | 'DONE' | 'CANCELED';

  /** Competition id. */
  competitionId: ICompetition['id'];

  /** User id. */
  userId: IUser['id'];

  /** Player snapshots. */
  playerSnapshots: IPlayerSnapshot[] & tags.MinItems<1>;

  /** Participation division infos. */
  participationDivisionInfos: IParticipationDivisionInfo[] & tags.MinItems<1>;

  /** Addtional infos */
  additionalInfos: IAdditionalInfo[];
}
