import {
  ICombinationDiscountSnapshot,
  ICombinationDiscountSnapshotCreateDto,
} from '../domain/interface/combination-discount-snapshot.interface';
import {
  ICompetition,
  ICompetitionCreateDto,
  ICompetitionQueryOptions,
  ICompetitionUpdateDto,
} from '../domain/interface/competition.interface';
import { IDivisionPack } from '../domain/interface/division-pack.interface';
import { IDivision } from '../domain/interface/division.interface';
import {
  IEarlybirdDiscountSnapshot,
  IEarlybirdDiscountSnapshotCreateDto,
} from '../domain/interface/earlybird-discount-snapshot.interface';

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
  /**
   * - Division packs.
   *
   * @minItems 1
   */
  divisionPacks: IDivisionPack[];
}

export interface CreateEarlybirdDiscountSnapshotParam {
  earlybirdDiscountSnapshotCreateDto: IEarlybirdDiscountSnapshotCreateDto;
}

export interface CreateCombinationDiscountSnapshotParam {
  combinationDiscountSnapshotCreateDto: ICombinationDiscountSnapshotCreateDto;
}

// Application Layer Result DTOs ----------------------------------------------
export interface CreateCompetitionRet {
  competition: Omit<ICompetition, 'divisions' | 'earlybirdDiscountSnapshots' | 'combinationDiscountSnapshots'>;
}

export interface UpdateCompetitionRet {
  competition: Omit<ICompetition, 'divisions' | 'earlybirdDiscountSnapshots' | 'combinationDiscountSnapshots'>;
}

export interface FindCompetitionsRet {
  competitions: Omit<ICompetition, 'divisions' | 'combinationDiscountSnapshots'>[];
  nextPage: number | null;
}

export interface GetCompetitionRet {
  competition: ICompetition;
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