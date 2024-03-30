import { ICompetition } from '../../../domain/competition.interface';

export interface UpdateCompetitionReqDto
  extends Partial<Omit<ICompetition, 'id' | 'viewCount' | 'status' | 'createdAt' | 'updatedAt'>> {}
