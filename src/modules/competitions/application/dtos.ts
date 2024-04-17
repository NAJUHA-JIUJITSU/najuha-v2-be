import { ICombinationDiscountSnapshot } from '../domain/interface/combination-discount-snapshot.interface';
import { ICompetition } from '../domain/interface/competition.interface';
import { IDivisionPack } from '../domain/interface/division-pack.interface';
import { IDivision } from '../domain/interface/division.interface';
import { IEarlybirdDiscountSnapshot } from '../domain/interface/earlybird-discount-snapshot.interface';

// Application Layer Param DTOs ----------------------------------------------
export interface CreateCompetitionParam {
  creatCompetitionDto: ICompetition.CreateDto;
}

export interface UpdateCompetitionParam {
  updateCompetitionDto: ICompetition.UpdateDto;
}

export interface FindCompetitionsParam {
  page: ICompetition.Query.Page;
  limit?: ICompetition.Query.Limit;
  dateFilter?: ICompetition.Query.DateFilter;
  locationFilter?: ICompetition.Query.LocationFilter;
  selectFilter?: ICompetition.Query.SelectFilter[];
  sortOption?: ICompetition.Query.SortOption;
  status?: ICompetition['status'];
}

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
  competitionId: ICompetition['id'];
  earlybirdDiscount: Pick<IEarlybirdDiscountSnapshot, 'earlybirdStartDate' | 'earlybirdEndDate' | 'discountAmount'>;
}

export interface CreateCombinationDiscountSnapshotParam {
  competitionId: ICompetition['id'];
  combinationDiscount: Pick<ICombinationDiscountSnapshot, 'combinationDiscountRules'>;
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
