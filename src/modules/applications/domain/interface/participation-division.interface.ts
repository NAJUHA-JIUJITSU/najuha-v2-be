import { IApplication } from './application.interface';
import { IParticipationDivisionSnapshot } from './participation-division-snapshot.interface';

export interface IParticipationDivision {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

  /** - created at. */
  createdAt: Date | string;

  /** - application id. */
  applicationId: IApplication['id'];

  /** - participation division snapshots. */
  participationDivisionSnapshots: IParticipationDivisionSnapshot[];
}
