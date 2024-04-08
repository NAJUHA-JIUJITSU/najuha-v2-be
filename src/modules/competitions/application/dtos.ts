import { ICombinationDiscountSnapshot } from '../domain/interface/combination-discount-snapshot.interface';
import { ICompetition } from '../domain/interface/competition.interface';
import { IDivisionPack } from '../domain/interface/division-pack.interface';
import { IDivision } from '../domain/interface/division.interface';
import { IEarlybirdDiscountSnapshot } from '../domain/interface/earlybird-discount-snapshot.interface';

// Application Layer Param DTOs ----------------------------------------------
export interface CreateCompetitionParam {
  creatCompetition: Partial<Omit<ICompetition, 'id' | 'status' | 'viewCount' | 'createdAt' | 'updatedAt'>>;
}

export interface UpdateCompetitionParam {
  updateCompetition: Pick<ICompetition, 'id'> &
    Partial<Omit<ICompetition, 'id' | 'status' | 'viewCount' | 'createdAt' | 'updatedAt'>>;
}

export interface FindCompetitionsParam {
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
  competition: ICompetition.Create.Competition;
}

export interface UpdateCompetitionRet {
  competition: ICompetition.Update.Competition;
}

export interface FindCompetitionsRet {
  competitions: ICompetition.Find.Competition[];
}

export interface GetCompetitionRet {
  competition: ICompetition.Get.Competition;
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
