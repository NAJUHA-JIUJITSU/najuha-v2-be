import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';

export interface CreateCompetitionReqDto
  extends Partial<
    Omit<
      Competition,
      'id' | 'earlyBirdDiscountStrategy' | 'divisions' | 'status' | 'viewCount' | 'createdAt' | 'updatedAt'
    >
  > {}
