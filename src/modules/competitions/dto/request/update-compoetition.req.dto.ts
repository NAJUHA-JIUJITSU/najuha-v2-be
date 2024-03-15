import { ICompetition } from 'src/interfaces/competition.interface';

export interface UpdateCompetitionReqDto extends Partial<Omit<ICompetition, 'id'>> {
  id: ICompetition['id'];
}

// export type UpdateCompetitionReqDto = Pick<ICompetition, 'id'> & Partial<Omit<ICompetition, 'id'>>;
