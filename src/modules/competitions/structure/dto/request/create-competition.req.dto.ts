import { ICompetition } from '../../interface/competition.interface';

export interface CreateCompetitionReqDto
  extends Partial<Omit<ICompetition, 'id' | 'status' | 'viewCount' | 'createdAt' | 'updatedAt'>> {}
