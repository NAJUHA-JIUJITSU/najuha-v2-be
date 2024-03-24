import { Competition } from 'src/infrastructure/database/entities/competition/competition.entity';

export interface UpdateCompetitionStatusReqDto {
  status: Competition['status'];
}
