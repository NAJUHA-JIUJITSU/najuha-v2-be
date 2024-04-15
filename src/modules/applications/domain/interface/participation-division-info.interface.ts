import { IApplication } from './application.interface';
import { IParticipationDivisionInfoSnapshot } from './participation-division-info-snapshot.interface';

export interface IParticipationDivisionInfo {
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

  participationDivisionInfoSnapshots: IParticipationDivisionInfoSnapshot[];
}
