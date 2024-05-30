import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { IPlayerSnapshot } from './player-snapshot.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';
import { tags } from 'typia';
import { IAdditionalInfo } from './additional-info.interface';
import { TId, TDateOrStringDate } from 'src/common/common-types';
import { IExpectedPayment } from './expected-payment.interface';

export interface IApplication {
  /** UUIDv7. */
  id: TId;

  /**  Created at. */
  createdAt: TDateOrStringDate;

  /** Updated at. */
  updatedAt: TDateOrStringDate;

  /** Deleted at. */
  deletedAt: TDateOrStringDate | null;

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

  /**
   * Expected payment.
   * READY 상태일 때만 조회결과에 포함됩니다.
   */
  expectedPayment?: IExpectedPayment | null;
}

export interface IApplicationQueryOptions {
  /** 현제 페이지 번호입니다. default: 0 */
  page: number;

  /** 한 페이지에 보여줄 아이템의 수입니다. default: 10, max: 30 */
  limit: number & tags.Type<'uint32'> & tags.Minimum<1> & tags.Maximum<30>;

  /** application status */
  status?: IApplication['status'];
}
