import { ICompetition } from '../../competition.interface';

export interface UpdateCompetitionStatusReqDto {
  status: ICompetition['status'];
}
