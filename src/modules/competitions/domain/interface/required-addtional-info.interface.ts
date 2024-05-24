import { tags } from 'typia';
import { ICompetition } from './competition.interface';
import { TId, TDateOrStringDate } from 'src/common/common-types';

/*
 * 대회신청시 추가 정보 입력 규칙.
 * - ex) 주민번호, 주소
 */
export interface IRequiredAdditionalInfo {
  /** UUIDv7. */
  id: TId;

  /** Type */
  type: 'SOCIAL_SECURITY_NUMBER' | 'ADDRESS';

  /** Description. */
  description: string & tags.MinLength<1> & tags.MaxLength<512>;

  /** CreatedAt. */
  createdAt: TDateOrStringDate;

  /** DeletedAT */
  deletedAt: null | TDateOrStringDate;

  /** Competition Id  */
  competitionId: ICompetition['id'];
}

export interface IRequiredAdditionalInfoCreateDto
  extends Pick<IRequiredAdditionalInfo, 'type' | 'description' | 'competitionId'> {}

export interface IRequiredAdditionalInfoUpdateDto
  extends Pick<IRequiredAdditionalInfo, 'id' | 'description' | 'competitionId'> {}
