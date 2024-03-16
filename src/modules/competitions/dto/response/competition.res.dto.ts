import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';

export interface CompetitionResDto extends Omit<CompetitionEntity, 'earlyBirdDiscountStrategy'> {}
