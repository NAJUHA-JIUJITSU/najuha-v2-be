import { CompetitionEntity } from 'src/modules/competitions/domain/competition.entity';

export interface CreateCompetitionReqDto
  extends Partial<
    Omit<
      CompetitionEntity,
      'id' | 'earlyBirdDiscountStrategy' | 'divisions' | 'status' | 'viewCount' | 'createdAt' | 'updatedAt'
    >
  > {}
