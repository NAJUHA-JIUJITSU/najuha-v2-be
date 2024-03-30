import { Competition } from 'src/infrastructure/database/entities/competition/competition.entity';
import { Division } from 'src/infrastructure/database/entities/competition/division.entity';
import { PlayerSnapshot } from 'src/infrastructure/database/entities/application/player-snapshot.entity';

export interface CreateApplicationReqDto {
  competitionId: Competition['id'];
  divisionIds: Division['id'][];
  player: Pick<PlayerSnapshot, 'belt' | 'network' | 'team' | 'masterName'>;
}
