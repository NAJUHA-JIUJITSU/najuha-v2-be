import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';

export interface UpdateCompetitionStatusReqDto {
  status: Competition['status'];
}
