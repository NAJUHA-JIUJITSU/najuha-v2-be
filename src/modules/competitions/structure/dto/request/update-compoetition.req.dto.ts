import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';

export interface UpdateCompetitionReqDto
  extends Partial<
    Omit<
      CompetitionEntity,
      'id' | 'earlyBirdDiscountStrategy' | 'divisions' | 'viewCount' | 'status' | 'createdAt' | 'updatedAt'
    >
  > {}
