import { CompetitionEntity } from 'src/modules/competitions/domain/competition.entity';

export interface UpdateCompetitionStatusReqDto {
  status: CompetitionEntity['status'];
}
