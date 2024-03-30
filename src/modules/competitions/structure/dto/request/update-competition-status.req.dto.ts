import { ICompetition } from '../../../domain/competition.interface';

export interface UpdateCompetitionStatusReqDto {
  status: ICompetition['status'];
}
