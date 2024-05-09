import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';
import { tags } from 'typia';
import { DateOrStringDate } from 'src/common/common-types';

export interface IParticipationDivisionInfoSnapshot {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** CreatedAt */
  createdAt: DateOrStringDate;

  /** - Participation division Info id. */
  participationDivisionInfoId: IParticipationDivisionInfo['id'];

  /** - Division id (참가한 부문 id). */
  participationDivisionId: IDivision['id'];

  /** - Division. (참가한 부문).*/
  division: IDivision;
}
