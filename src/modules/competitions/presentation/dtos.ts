import { tags } from 'typia';
import {
  CreateCombinationDiscountSnapshotParam,
  CreateCombinationDiscountSnapshotRet,
  CreateCompetitionParam,
  CreateCompetitionRet,
  CreateDivisionsParam,
  CreateDivisionsRet,
  CreateEarlybirdDiscountSnapshotParam,
  CreateEarlybirdDiscountSnapshotRet,
  FindCompetitionsParam,
  FindCompetitionsRet,
  GetCompetitionRet,
  UpdateCompetitionParam,
  UpdateCompetitionRet,
  UpdateCompetitionStatusParam,
} from '../application/dtos';
import { ICompetitionQueryOptions } from '../domain/interface/competition.interface';

// Presentation Layer Request DTOs --------------------------------------------
export type CreateCompetitionReqBody = CreateCompetitionParam['competitionCreateDto'];

export type UpdateCompetitionReqBody = Omit<UpdateCompetitionParam['competitionUpdateDto'], 'id'>;

export interface UpdateCompetitionStatusReqBody extends Pick<UpdateCompetitionStatusParam, 'status'> {}

export interface FindCompetitionsReqQuery
  extends Partial<Pick<ICompetitionQueryOptions, 'page' | 'limit' | 'sortOption' | 'locationFilter' | 'selectFilter'>> {
  /** - 날짜 필터. YYYY-MM 형식입니다. */
  dateFilter?: string & tags.Pattern<'^[0-9]{4}-[0-9]{2}$'>;
}

export interface CreateDivisionsReqBody extends Pick<CreateDivisionsParam, 'divisionPacks'> {}

export type CreateEarlybirdDiscountSnapshotReqBody = Omit<
  CreateEarlybirdDiscountSnapshotParam['earlybirdDiscountSnapshotCreateDto'],
  'competitionId'
>;

export type CreateCombinationDiscountSnapshotReqBody = Omit<
  CreateCombinationDiscountSnapshotParam['combinationDiscountSnapshotCreateDto'],
  'competitionId'
>;

// Presentation Layer Response DTOs -------------------------------------------
export interface CreateCompetitionRes extends CreateCompetitionRet {}

export interface FindCompetitionsRes extends FindCompetitionsRet {}

export interface GetCompetitionRes extends GetCompetitionRet {}

export interface UpdateCompetitionRes extends UpdateCompetitionRet {}

export interface UpdateCompetitionStatusRes extends UpdateCompetitionRet {}

export interface CreateDivisionsRes extends CreateDivisionsRet {}

export interface CreateEarlybirdDiscountSnapshotRes extends CreateEarlybirdDiscountSnapshotRet {}

export interface CreateCombinationDiscountSnapshotRes extends CreateCombinationDiscountSnapshotRet {}
