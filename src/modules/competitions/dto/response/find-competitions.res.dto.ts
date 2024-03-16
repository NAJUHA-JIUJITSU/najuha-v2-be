import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';

export type FindCompetitionsResDto = Omit<CompetitionEntity, 'earlyBirdDiscountStrategy'>[];
