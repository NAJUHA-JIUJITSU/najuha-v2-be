import {
  ICombinationDiscountSnapshot,
  ICombinationDiscountSnapshotCreateDto,
} from '../domain/interface/combination-discount-snapshot.interface';
import {
  ICompetitioinWithoutRelations,
  ICompetition,
  ICompetitionCreateDto,
  ICompetitionWithEarlybirdDiscountSnapshots,
  ICompetitionQueryOptions,
  ICompetitionUpdateDto,
} from '../domain/interface/competition.interface';
import { IDivisionPack } from '../domain/interface/division-pack.interface';
import { IDivision } from '../domain/interface/division.interface';
import {
  IEarlybirdDiscountSnapshot,
  IEarlybirdDiscountSnapshotCreateDto,
} from '../domain/interface/earlybird-discount-snapshot.interface';
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

export interface CreateRequiredAdditionalInfoParam {
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
  competition: ICompetitioinWithoutRelations;
}

export interface UpdateCompetitionRet {
  competition: ICompetitioinWithoutRelations;
}

export interface FindCompetitionsRet {
  competitions: ICompetitionWithEarlybirdDiscountSnapshots[];
  nextPage: number | null;
}

export interface GetCompetitionRet {
  competition: Required<ICompetition>;
}

export interface CreateDivisionsRet {
  divisions: IDivision[];
}

export interface CreateEarlybirdDiscountSnapshotRet {
  earlybirdDiscountSnapshot: IEarlybirdDiscountSnapshot;
}

export interface CreateCombinationDiscountSnapshotRet {
  combinationDiscountSnapshot: ICombinationDiscountSnapshot;
}

export interface createRequiredAdditionalInfoRet {
  requiredAdditionalInfo: IRequiredAdditionalInfo;
}
