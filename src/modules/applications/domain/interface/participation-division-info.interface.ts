import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
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

  /**
   * - 참가 부문 ID.
   * @minimum 1
   */
  participationDivisionInfoSnapshots: IParticipationDivisionInfoSnapshot[];
}

export namespace IParticipationDivisionInfo {
  export namespace ModelValue {
    export interface Base extends IParticipationDivisionInfo {}
  }

  export interface UpdateDto {
    /** - 수정하고자 하는 참가부문 정보 ID (식별자). */
    id: IParticipationDivisionInfo['id'];

    /** - 새로 참가 하고자 하는 부문 ID. */
    newParticipationDivisionId: IDivision['id'];
  }
}
