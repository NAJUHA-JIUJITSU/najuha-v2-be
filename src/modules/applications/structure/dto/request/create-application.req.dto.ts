import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';
import { PlayerSnapshot } from 'src/modules/applications/domain/entities/player-snapshot.entity';

export interface CreateApplicationReqDto {
  competitionId: Competition['id'];
  divisionIds: Division['id'][];
  player: Pick<PlayerSnapshot, 'belt' | 'network' | 'team' | 'masterName'>;
}
