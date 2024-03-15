import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';

export interface UpdateCompetitionReqDto extends Partial<Omit<CompetitionEntity, 'id'>> {
  id: CompetitionEntity['id'];
}

// export type UpdateCompetitionReqDto = Pick<CompetitionEntity, 'id'> & Partial<Omit<CompetitionEntity, 'id'>>;
