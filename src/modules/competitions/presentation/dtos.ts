import { tags } from 'typia';
import {
  CreateCombinationDiscountSnapshotRet,
  CreateCompetitionRet,
  CreateDivisionsRet,
  CreateEarlybirdDiscountSnapshotRet,
  FindCompetitionsRet,
  GetCompetitionRet,
  UpdateCompetitionRet,
  CreateRequiredAdditionalInfoRet,
} from '../application/dtos';
import {
  ICompetition,
  ICompetitionCreateDto,
  ICompetitionQueryOptions,
  ICompetitionUpdateDto,
} from '../domain/interface/competition.interface';
import { IDivisionPack } from '../domain/interface/division-pack.interface';
import { IEarlybirdDiscountSnapshotCreateDto } from '../domain/interface/earlybird-discount-snapshot.interface';
import { ICombinationDiscountSnapshotCreateDto } from '../domain/interface/combination-discount-snapshot.interface';
import {
  IRequiredAdditionalInfoCreateDto,
  IRequiredAdditionalInfoUpdateDto,
} from '../domain/interface/required-addtional-info.interface';

// Presentation Layer Request DTOs --------------------------------------------
export interface CreateCompetitionReqBody extends ICompetitionCreateDto {}

export interface UpdateCompetitionReqBody extends Omit<ICompetitionUpdateDto, 'id'> {}

export interface UpdateCompetitionStatusReqBody extends Pick<ICompetition, 'status'> {}

export interface FindCompetitionsReqQuery
  extends Partial<Pick<ICompetitionQueryOptions, 'page' | 'limit' | 'sortOption' | 'locationFilter' | 'selectFilter'>> {
  /** - 날짜 필터. YYYY-MM 형식입니다. */
  dateFilter?: string & tags.Pattern<'^[0-9]{4}-[0-9]{2}$'>;
}

export interface CreateDivisionsReqBody {
  /**
   * - Division packs.
   *
   * @minItems 1
   */
  divisionPacks: IDivisionPack[];
}

export interface CreateEarlybirdDiscountSnapshotReqBody
  extends Omit<IEarlybirdDiscountSnapshotCreateDto, 'competitionId'> {}

export interface CreateCombinationDiscountSnapshotReqBody
  extends Omit<ICombinationDiscountSnapshotCreateDto, 'competitionId'> {}

export interface CreateRequiredAdditionalInfoReqBody extends Omit<IRequiredAdditionalInfoCreateDto, 'competitionId'> {}

export interface UpdateRequiredAdditionalInfoReqBody
  extends Omit<IRequiredAdditionalInfoUpdateDto, 'competitionId' | 'id'> {}

// Presentation Layer Response DTOs -------------------------------------------
export interface CreateCompetitionRes extends CreateCompetitionRet {}

export interface FindCompetitionsRes extends FindCompetitionsRet {}

export interface GetCompetitionRes extends GetCompetitionRet {}

export interface UpdateCompetitionRes extends UpdateCompetitionRet {}

export interface UpdateCompetitionStatusRes extends UpdateCompetitionRet {}

export interface CreateDivisionsRes extends CreateDivisionsRet {}

export interface CreateEarlybirdDiscountSnapshotRes extends CreateEarlybirdDiscountSnapshotRet {}

export interface CreateCombinationDiscountSnapshotRes extends CreateCombinationDiscountSnapshotRet {}

export interface CreateRequiredAdditionalInfoRes extends CreateRequiredAdditionalInfoRet {}
