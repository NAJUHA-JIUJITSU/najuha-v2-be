import { tags } from 'typia';
import { ICompetition } from './competition.interface';
import { DateOrStringDate } from 'src/common/common-types';

/*
 * 대회신청시 추가 정보 입력 규칙.
 * - ex) 주민번호, 주소
 */
export interface IRequiredAdditionalInfo {
  /** UUIDv7. */
  id: string & tags.MinLength<36> & tags.MaxLength<36>;

  /** Type */
  type: 'SOCIAL_SECURITY_NUMBER' | 'ADDRESS';

  /** Description. */
  description: string & tags.MinLength<1> & tags.MaxLength<512>;

  /** CreatedAt. */
  createdAt: DateOrStringDate;

  /** DeletedAT */
  deletedAt: null | DateOrStringDate;

  /** Competition Id  */
  competitionId: ICompetition['id'];
}

export interface IRequiredAdditionalInfoCreateDto
  extends Pick<IRequiredAdditionalInfo, 'type' | 'description' | 'competitionId'> {}

export interface IRequiredAdditionalInfoUpdateDto
  extends Pick<IRequiredAdditionalInfo, 'id' | 'description' | 'competitionId'> {}
