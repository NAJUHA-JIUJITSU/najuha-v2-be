import { ICompetition } from '../../domain/structure/competition.interface';

export interface CreateCompetitionReqDto
  extends Partial<
    Omit<
      ICompetition,
      | 'id'
      | 'status'
      | 'viewCount'
      | 'createdAt'
      | 'updatedAt'
      | 'divisions'
      | 'earlybirdDiscountSnapshots'
      | 'combinationDiscountSnapshots'
    >
  > {}
