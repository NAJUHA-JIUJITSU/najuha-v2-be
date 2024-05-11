import { ICombinationDiscountSnapshotCreateDto } from '../domain/interface/combination-discount-snapshot.interface';
import {
  ICompetitionWithoutRelations,
  ICompetition,
  ICompetitionCreateDto,
  ICompetitionWithEarlybirdDiscountSnapshots,
  ICompetitionQueryOptions,
  ICompetitionUpdateDto,
} from '../domain/interface/competition.interface';
import { IDivisionPack } from '../domain/interface/division-pack.interface';
import { IEarlybirdDiscountSnapshotCreateDto } from '../domain/interface/earlybird-discount-snapshot.interface';
import {
  IRequiredAdditionalInfo,
  IRequiredAdditionalInfoCreateDto,
  IRequiredAdditionalInfoUpdateDto,
} from '../domain/interface/required-addtional-info.interface';

// Application Layer Param DTOs ----------------------------------------------
export interface CreateCompetitionParam {
  competitionCreateDto: ICompetitionCreateDto;
}

export interface UpdateCompetitionParam {
  competitionUpdateDto: ICompetitionUpdateDto;
}

export interface FindCompetitionsParam extends ICompetitionQueryOptions {}

export interface GetCompetitionParam {
  competitionId: ICompetition['id'];
  status?: ICompetition['status'];
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

export interface UpdateRequiredAdditionalInfoParam {
  requiredAdditionalInfoUpdateDto: IRequiredAdditionalInfoUpdateDto;
}

export interface DeleteRequiredAdditionalInfoParam {
  competitionId: ICompetition['id'];
  requiredAdditionalInfoId: IRequiredAdditionalInfo['id'];
}

// Application Layer Result DTOs ----------------------------------------------
export interface CreateCompetitionRet {
  competition: ICompetitionWithoutRelations;
}

export interface UpdateCompetitionRet {
  competition: ICompetition;
}

export interface UpdateCompetitionStatusRet {
  competition: ICompetition;
}

export interface FindCompetitionsRet {
  competitions: ICompetitionWithEarlybirdDiscountSnapshots[];
  nextPage?: number;
}

export interface GetCompetitionRet {
  competition: Required<ICompetition>;
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
