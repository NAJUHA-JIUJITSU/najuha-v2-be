import { PlayerSnapshot } from '../../domain/entities/player-snapshot.entity';

export interface IPlayerSnapshot extends Omit<PlayerSnapshot, 'application'> {}
