import { IDivision } from 'src/modules/competitions/domain/structure/division.interface';
import { IPlayerSnapshot } from '../../domain/structure/player-snapshot.interface';

export interface UpdateApplicationReqDto {
  dvisionIds: IDivision['id'][];
  player: Pick<
    IPlayerSnapshot,
    'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
  >;
}
