import { tags } from 'typia';
import { ICompetition } from './competition.interface';

/*
 * 대회신청시 추가 정보 입력 규칙.
 * - ex) 주민번호, 주소
 */
export interface IRequiredAdditionalInfo {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /** Type */
  type: 'SOCIAL_SECURITY_NUMBER' | 'ADDRESS';

  /** Description. */
  description: string & tags.MinLength<1> & tags.MaxLength<512>;

  /** CreatedAt. */
  createdAt: Date | (string & tags.Format<'date-time'>);

  /** Competition Id  */
  competitionId: ICompetition['id'];
}

export interface IRequiredAdditionalInfoCreateDto
  extends Pick<IRequiredAdditionalInfo, 'type' | 'description' | 'competitionId'> {}

export interface IRequiredAdditionalInfoUpdateDto
  extends Pick<IRequiredAdditionalInfo, 'id' | 'description' | 'competitionId'> {}
