import { ICompetition } from '../../domain/structure/competition.interface';

export interface UpdateCompetitionStatusReqDto {
  status: ICompetition['status'];
}
