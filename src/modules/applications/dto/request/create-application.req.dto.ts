import { IPlayerSnapshot } from '../../domain/structure/player-snapshot.interface';
import { IDivision } from 'src/modules/competitions/domain/structure/division.interface';
import { ICompetition } from 'src/modules/competitions/domain/structure/competition.interface';

export interface CreateApplicationReqDto {
  competitionId: ICompetition['id'];
  divisionIds: IDivision['id'][];
  player: Pick<
    IPlayerSnapshot,
    'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
  >;
}
