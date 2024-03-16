import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';

export interface CreateCompetitionReqDto
  extends Partial<
    Omit<
      CompetitionEntity,
      'id' | 'earlyBirdDiscountStrategy' | 'divisions' | 'status' | 'viewCount' | 'createdAt' | 'updatedAt'
    >
  > {}
