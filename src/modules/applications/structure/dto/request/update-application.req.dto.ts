import { IDivision } from 'src/modules/competitions/structure/interface/division.interface';
import { IPlayerSnapshot } from '../../interface/player-snapshot.interface';

export interface UpdateApplicationReqDto {
  dvisionIds: IDivision['id'][];
  palyer: Pick<
    IPlayerSnapshot,
    'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
  >;
}
