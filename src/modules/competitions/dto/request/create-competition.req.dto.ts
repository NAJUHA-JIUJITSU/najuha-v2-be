import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';

export interface CreateCompetitionReqDto extends Partial<CompetitionEntity> {}
