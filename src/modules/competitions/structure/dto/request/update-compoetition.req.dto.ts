import { OmitOptional } from 'src/common/omit-optional.type';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';

export interface UpdateCompetitionReqDto
  extends Partial<Omit<OmitOptional<CompetitionEntity>, 'id' | 'viewCount' | 'status' | 'createdAt' | 'updatedAt'>> {}