import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';
import { IApplication } from './application.interface';
import { IParticipationDivisionSnapshot } from './participation-division-snapshot.interface';

export interface IParticipationDivision {
  /**
   * - participation division id.
   * @type uint32
   */
  id: number;

  /** - created at. */
  createdAt: Date | string;

  /** - application id. */
  applicationId: IApplication['id'];

  /** - payed price snapshot id. */
  priceSnapshotId: IPriceSnapshot['id'];

  participationDivisionSnapshots: IParticipationDivisionSnapshot[];

  // cancleId
}
