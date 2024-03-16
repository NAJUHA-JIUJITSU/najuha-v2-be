import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';

export interface UpdateCompetitionStatusReqDto {
  status: CompetitionEntity['status'];
}
