import { OmitOptional } from 'src/common/omit-optional.type';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';

export interface CreateCompetitionReqDto
  extends Partial<Omit<OmitOptional<CompetitionEntity>, 'id' | 'status' | 'viewCount' | 'createdAt' | 'updatedAt'>> {}
