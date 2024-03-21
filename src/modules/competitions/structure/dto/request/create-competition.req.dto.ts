import { ICompetition } from '../../competition.interface';

export interface CreateCompetitionReqDto
  extends Partial<
    Omit<
      ICompetition,
      'id' | 'earlyBirdDiscountStrategy' | 'divisions' | 'status' | 'viewCount' | 'createdAt' | 'updatedAt'
    >
  > {}
