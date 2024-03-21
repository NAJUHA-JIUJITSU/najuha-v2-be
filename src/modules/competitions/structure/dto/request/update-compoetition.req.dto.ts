import { ICompetition } from '../../competition.interface';

export interface UpdateCompetitionReqDto
  extends Partial<
    Omit<
      ICompetition,
      'id' | 'earlyBirdDiscountStrategy' | 'divisions' | 'viewCount' | 'status' | 'createdAt' | 'updatedAt'
    >
  > {}
