import { ICompetition } from '../../domain/structure/competition.interface';

export interface UpdateCompetitionReqDto
  extends Partial<
    Omit<
      ICompetition,
      | 'id'
      | 'viewCount'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'divisions'
      | 'earlybirdDiscountSnapshots'
      | 'combinationDiscountSnapshots'
    >
  > {}
