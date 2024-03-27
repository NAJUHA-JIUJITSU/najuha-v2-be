import { ICompetition } from '../../interface/competition.interface';

export interface UpdateCompetitionStatusReqDto {
  status: ICompetition['status'];
}
