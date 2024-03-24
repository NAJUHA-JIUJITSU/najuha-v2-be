import { OmitOptional } from 'src/common/omit-optional.type';
import { Competition } from 'src/infrastructure/database/entities/competition/competition.entity';

export interface CreateCompetitionReqDto
  extends Partial<Omit<OmitOptional<Competition>, 'id' | 'status' | 'viewCount' | 'createdAt' | 'updatedAt'>> {}
