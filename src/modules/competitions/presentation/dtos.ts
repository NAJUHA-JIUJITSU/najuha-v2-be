import exp from 'constants';
import {
  CreateCombinationDiscountSnapshotParam,
  CreateCombinationDiscountSnapshotRet,
  CreateCompetitionParam,
  CreateCompetitionRet,
  CreateDivisionsParam,
  CreateDivisionsRet,
  CreateEarlybirdDiscountSnapshotParam,
  CreateEarlybirdDiscountSnapshotRet,
  FindCompetitionsRet,
  GetCompetitionRet,
  UpdateCompetitionParam,
  UpdateCompetitionRet,
  UpdateCompetitionStatusParam,
} from '../application/dtos';

// Presentation Layer Request DTOs --------------------------------------------
export type CreateCompetitionReqBody = CreateCompetitionParam['creatCompetitionDto'];

export type UpdateCompetitionReqBody = Omit<UpdateCompetitionParam['updateCompetition'], 'id'>;

export interface UpdateCompetitionStatusReqBody extends Pick<UpdateCompetitionStatusParam, 'status'> {}

export interface CreateDivisionsReqBody extends Pick<CreateDivisionsParam, 'divisionPacks'> {}

export type CreateEarlybirdDiscountSnapshotReqBody = CreateEarlybirdDiscountSnapshotParam['earlybirdDiscount'];

export type CreateCombinationDiscountSnapshotReqBody = CreateCombinationDiscountSnapshotParam['combinationDiscount'];

// Presentation Layer Response DTOs -------------------------------------------
export interface CreateCompetitionRes extends CreateCompetitionRet {}

export interface FindCompetitionsRes extends FindCompetitionsRet {}

export interface GetCompetitionRes extends GetCompetitionRet {}

export interface UpdateCompetitionRes extends UpdateCompetitionRet {}

export interface UpdateCompetitionStatusRes extends UpdateCompetitionRet {}

export interface CreateDivisionsRes extends CreateDivisionsRet {}

export interface CreateEarlybirdDiscountSnapshotRes extends CreateEarlybirdDiscountSnapshotRet {}

export interface CreateCombinationDiscountSnapshotRes extends CreateCombinationDiscountSnapshotRet {}
