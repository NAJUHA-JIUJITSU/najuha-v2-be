import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';

export interface UpdateCompetitionStatusReqDto {
  status: CompetitionEntity['status'];
}
