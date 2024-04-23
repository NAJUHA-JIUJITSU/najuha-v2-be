import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IApplication } from './application.interface';
import { IParticipationDivisionInfoSnapshot } from './participation-division-info-snapshot.interface';
import { tags } from 'typia';

export interface IParticipationDivisionInfo {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** CreatedAt. */
  createdAt: Date | string;

  /** Application id. */
  applicationId: IApplication['id'];

  /** 참가부문 정보 스냅샷. */
  participationDivisionInfoSnapshots: IParticipationDivisionInfoSnapshot[] & tags.MinItems<1>;
}

export namespace IParticipationDivisionInfo {
  export namespace Entity {
    export interface ParticipationDivisionInfo extends IParticipationDivisionInfo {}
  }

  export namespace Dto {
    export interface Update {
      /** 수정하고자 하는 참가부문 정보 ID (식별자). */
      id: IParticipationDivisionInfo['id'];

      /** 새로 참가 하고자 하는 부문 ID. */
      newParticipationDivisionId: IDivision['id'];
    }
  }
}
