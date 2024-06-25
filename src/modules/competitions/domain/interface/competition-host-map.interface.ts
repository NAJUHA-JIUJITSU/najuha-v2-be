import { TId } from '../../../../common/common-types';
import { IUser } from '../../../users/domain/interface/user.interface';
import { ICompetition } from './competition.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/** 대회 주최자 정보 매핑 테이블. */
export interface ICompetitionHostMap {
  /** UUID v7. */
  id: TId;

  /** 주최자 User ID. */
  hostId: IUser['id'];

  /** 주체 대회 ID. */
  competitionId: ICompetition['id'];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface ICompetitionHostMapModelData extends ICompetitionHostMap {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface ICompetitionHostMapCreateDto extends Pick<ICompetitionHostMap, 'hostId' | 'competitionId'> {}
