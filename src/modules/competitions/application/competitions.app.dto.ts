import { IUser } from '../../users/domain/interface/user.interface';
import { ICombinationDiscountSnapshotCreateDto } from '../domain/interface/combination-discount-snapshot.interface';
import {
  ICompetition,
  ICompetitionBasicInfo,
  ICompetitionCreateDto,
  ICompetitionSummary,
  ICompetitionQueryOptions,
  ICompetitionUpdateDto,
} from '../domain/interface/competition.interface';
import { IDivisionPack } from '../domain/interface/division-pack.interface';
import { IEarlybirdDiscountSnapshotCreateDto } from '../domain/interface/earlybird-discount-snapshot.interface';
import {
  IRequiredAdditionalInfo,
  IRequiredAdditionalInfoCreateDto,
  IRequiredAdditionalInfoUpdateDto,
} from '../domain/interface/required-additional-info.interface';
import { TPaginationParam, TPaginationRet } from '../../../common/common-types';
import { ICompetitionPosterImageCreateDto } from '../domain/interface/competition-poster-image.interface';

// ---------------------------------------------------------------------------
// competitionsAppService Param
// ---------------------------------------------------------------------------
export interface CreateCompetitionParam {
  competitionCreateDto: ICompetitionCreateDto;
}

export interface UpdateCompetitionParam {
  competitionUpdateDto: ICompetitionUpdateDto;
}

export interface FindCompetitionsParam extends TPaginationParam<ICompetitionQueryOptions> {}

export interface GetCompetitionParam {
  competitionId: ICompetition['id'];
  status?: ICompetition['status'];
  hostId?: IUser['id'];
}

export interface UpdateCompetitionStatusParam {
  competitionId: ICompetition['id'];
  status: ICompetition['status'];
}

export interface CreateDivisionsParam {
  competitionId: ICompetition['id'];
  divisionPacks: IDivisionPack[];
}

export interface CreateEarlybirdDiscountSnapshotParam {
  earlybirdDiscountSnapshotCreateDto: IEarlybirdDiscountSnapshotCreateDto;
}

export interface CreateCombinationDiscountSnapshotParam {
  combinationDiscountSnapshotCreateDto: ICombinationDiscountSnapshotCreateDto;
}

export interface CreateCompetitionRequiredAdditionalInfoParam {
  requiredAdditionalInfoCreateDto: IRequiredAdditionalInfoCreateDto;
}

export interface UpdateCompetitionRequiredAdditionalInfoParam {
  requiredAdditionalInfoUpdateDto: IRequiredAdditionalInfoUpdateDto;
}

export interface DeleteRequiredAdditionalInfoParam {
  competitionId: ICompetition['id'];
  requiredAdditionalInfoId: IRequiredAdditionalInfo['id'];
}

export interface CreateCompetitionPosterImageParam {
  competitionPosterImageCreateDto: ICompetitionPosterImageCreateDto;
}

export interface DeleteCompetitionPosterImageParam {
  competitionId: ICompetition['id'];
}

// ---------------------------------------------------------------------------
// competitionsAppService Result
// ---------------------------------------------------------------------------
export interface CreateCompetitionRet {
  competition: ICompetitionBasicInfo;
}

export interface UpdateCompetitionRet {
  competition: ICompetition;
}

export interface UpdateCompetitionStatusRet {
  competition: ICompetition;
}

export interface FindCompetitionsRet extends TPaginationRet<{ competitions: ICompetitionSummary[] }> {}

export interface GetCompetitionRet {
  competition: ICompetition;
}

export interface CreateCompetitionDivisionsRet {
  competition: ICompetition;
}

export interface CreateCompetitionEarlybirdDiscountSnapshotRet {
  competition: ICompetition;
}

export interface CreateCompetitionCombinationDiscountSnapshotRet {
  competition: ICompetition;
}

export interface CreateCompetitionRequiredAdditionalInfoRet {
  competition: ICompetition;
}

export interface UpdateCompetitionRequiredAdditionalInfoRet {
  competition: ICompetition;
}

export interface DeleteCompetitionRequiredAdditionalInfoRet {
  competition: ICompetition;
}

export interface CreateCompetitionPosterImageRet {
  competition: ICompetition;
}
