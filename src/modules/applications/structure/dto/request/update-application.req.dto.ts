import { IDivision } from 'src/modules/competitions/domain/division.interface';
import { IPlayerSnapshot } from '../../../domain/player-snapshot.interface';

export interface UpdateApplicationReqDto {
  dvisionIds: IDivision['id'][];
  palyer: Pick<
    IPlayerSnapshot,
    'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
  >;
}
