import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/structure/combination-discount-snapshot.interface';
import { ICompetition } from 'src/modules/competitions/domain/structure/competition.interface';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/structure/earlybird-discount-snapshot.interface';
import { IUser } from 'src/modules/users/domain/structure/user.interface';
import { IPlayerSnapshot } from './player-snapshot.interface';
import { IParticipationDivision } from './participation-division.interface';

export interface IApplication {
  /**
   * - application id.
   * @type uint32
   */
  id: number;

  /**  - created at. */
  createdAt: Date | string;

  /** - updated at. */
  updatedAt: Date | string;

  /**
   * - status.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   */
  status: 'READY' | 'DONE' | 'CANCELED';

  earlybirdDiscountSnapshotId: IEarlybirdDiscountSnapshot['id'];

  /** - combination discount snapshot id. */
  combinationDiscountSnapshotId: ICombinationDiscountSnapshot['id'];

  /** - competition id. */
  competitionId: ICompetition['id'];

  /** - user id. */
  userId: IUser['id'];

  playerSnapshots: IPlayerSnapshot[];

  participationDivisions: IParticipationDivision[];
}
