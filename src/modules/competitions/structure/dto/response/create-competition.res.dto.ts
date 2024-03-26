import { OmitOptional } from 'src/common/omit-optional.type';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';

export interface CreateCompetitionResDto {
  competition: OmitOptional<Competition>;
}
