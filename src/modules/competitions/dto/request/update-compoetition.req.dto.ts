import { Competition } from 'src/modules/competitions/domain/competition.entity';

export interface UpdateCompetitionReqDto
  extends Partial<
    Omit<
      Competition,
      'id' | 'earlyBirdDiscountStrategy' | 'divisions' | 'viewCount' | 'status' | 'createdAt' | 'updatedAt'
    >
  > {}
