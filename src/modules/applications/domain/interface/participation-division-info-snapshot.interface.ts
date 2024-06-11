import { IDivision } from '../../../competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';
import { tags } from 'typia';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

export interface IParticipationDivisionInfoSnapshot {
  /** UUID v7. */
  id: TId;

  /** CreatedAt */
  createdAt: TDateOrStringDate;

  /** - Participation division Info id. */
  participationDivisionInfoId: IParticipationDivisionInfo['id'];

  /** - Division id (참가한 부문 id). */
  participationDivisionId: IDivision['id'];

  /** - Division. (참가한 부문).*/
  division: IDivision;
}
