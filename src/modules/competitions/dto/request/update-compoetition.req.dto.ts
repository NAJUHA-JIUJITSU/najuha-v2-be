import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';

export interface UpdateCompetitionReqDto
  extends Partial<
    Omit<CompetitionEntity, 'id' | 'earlyBirdDiscountStrategy' | 'viewCount' | 'status' | 'createdAt' | 'updatedAt'>
  > {}
