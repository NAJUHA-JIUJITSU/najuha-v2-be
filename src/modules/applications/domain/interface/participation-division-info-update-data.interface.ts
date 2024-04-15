import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IParticipationDivisionInfo } from './participation-division-info.interface';

export interface IParticipationDivisionInfoUpdateData {
  /**
   * 수정하고자 하는 참가부문 정보 ID (식별자)
   */
  participationDivisionInfoId: IParticipationDivisionInfo['id'];

  /**
   * 수정하고자 하는 참가부문 ID
   */
  newParticipationDivisionId: IDivision['id'];
}
