import { ParticipationDivision } from '../../domain/entities/participation-divsion.entity';

export interface IParticipationDivision
  extends Omit<ParticipationDivision, 'application' | 'priceSnapshot' | 'participationDivisionSnapshots'> {}
