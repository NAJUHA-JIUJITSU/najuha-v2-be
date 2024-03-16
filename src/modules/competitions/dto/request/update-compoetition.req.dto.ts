import { CompetitionEntity } from 'src/modules/competitions/domain/competition.entity';

export interface UpdateCompetitionReqDto
  extends Partial<
    Omit<
      CompetitionEntity,
      'id' | 'earlyBirdDiscountStrategy' | 'divisions' | 'viewCount' | 'status' | 'createdAt' | 'updatedAt'
    >
  > {}
