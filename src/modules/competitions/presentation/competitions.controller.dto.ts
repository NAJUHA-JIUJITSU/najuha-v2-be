import { tags } from 'typia';
import {
  CreateCompetitionCombinationDiscountSnapshotRet,
  CreateCompetitionRet,
  CreateCompetitionDivisionsRet,
  CreateCompetitionEarlybirdDiscountSnapshotRet,
  FindCompetitionsRet,
  GetCompetitionRet,
  UpdateCompetitionRet,
  CreateCompetitionRequiredAdditionalInfoRet,
} from '../application/competitions.app.dto';
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
import { TPaginationParam } from 'src/common/common-types';
import { ICompetitionPosterImageCreateDto } from '../domain/interface/competition-poster-image.interface';

// ---------------------------------------------------------------------------
// competitionsController Request
// ---------------------------------------------------------------------------
export interface CreateCompetitionReqBody extends ICompetitionCreateDto {}

export interface UpdateCompetitionReqBody extends Omit<ICompetitionUpdateDto, 'id'> {}

export interface UpdateCompetitionStatusReqBody extends Pick<ICompetition, 'status'> {}

export interface FindCompetitionsReqQuery
  extends Partial<
    TPaginationParam<
      Pick<ICompetitionQueryOptions, 'sortOption' | 'locationFilter' | 'selectFilter'> & {
        /** - 날짜 필터. YYYY-MM 형식입니다. */
        dateFilter: string & tags.Pattern<'^[0-9]{4}-[0-9]{2}$'>;
      }
    >
  > {}

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

export interface CreateCompetitionRequiredAdditionalInfoReqBody
  extends Omit<IRequiredAdditionalInfoCreateDto, 'competitionId'> {}

export interface UpdateRequiredAdditionalInfoReqBody
  extends Omit<IRequiredAdditionalInfoUpdateDto, 'competitionId' | 'id'> {}

export interface CreateCompetitionPosterImageReqBody extends Omit<ICompetitionPosterImageCreateDto, 'competitionId'> {}

// ---------------------------------------------------------------------------
// competitionsController Response
// ---------------------------------------------------------------------------
export interface CreateCompetitionRes extends CreateCompetitionRet {}

export interface FindCompetitionsRes extends FindCompetitionsRet {}

export interface GetCompetitionRes extends GetCompetitionRet {}

export interface UpdateCompetitionRes extends UpdateCompetitionRet {}

export interface UpdateCompetitionStatusRes extends UpdateCompetitionRet {}

export interface CreateCompetitionDivisionsRes extends CreateCompetitionDivisionsRet {}

export interface CreateEarlybirdDiscountSnapshotRes extends CreateCompetitionEarlybirdDiscountSnapshotRet {}

export interface CreateCombinationDiscountSnapshotRes extends CreateCompetitionCombinationDiscountSnapshotRet {}

export interface CreateCompetitionRequiredAdditionalInfoRes extends CreateCompetitionRequiredAdditionalInfoRet {}

export interface UpdateCompetitionRequiredAdditionalInfoRes extends CreateCompetitionRequiredAdditionalInfoRet {}

export interface DeleteCompetitionRequiredAdditionalInfoRes extends CreateCompetitionRequiredAdditionalInfoRet {}

export interface CreateCompetitionPosterImageRes extends CreateCompetitionRet {}
