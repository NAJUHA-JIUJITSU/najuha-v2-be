import { ParticipationDivisionSnapshot } from '../../domain/entities/participation-division-snapshot.entity';

export interface IParticipationDivisionSnapshot
  extends Omit<ParticipationDivisionSnapshot, 'participationDivision' | 'division'> {}
