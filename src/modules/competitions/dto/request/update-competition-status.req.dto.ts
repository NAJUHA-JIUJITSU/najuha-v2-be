import { Competition } from 'src/modules/competitions/domain/competition.entity';

export interface UpdateCompetitionStatusReqDto {
  status: Competition['status'];
}
