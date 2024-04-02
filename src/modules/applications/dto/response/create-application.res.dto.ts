import { IApplication } from '../../domain/structure/application.interface';
import { IParticipationDivision } from '../../domain/structure/participation-division.interface';

interface SParticipationDivision extends Omit<IParticipationDivision, 'priceSnapshotId'> {}

interface SApplication
  extends Omit<
    IApplication,
    'earlybirdDiscountSnapshotId' | 'combinationDiscountSnapshotId' | 'participationDivisions'
  > {
  participationDivisions: SParticipationDivision[];
}

export interface CreateApplicationResDto {
  application: SApplication;
}
