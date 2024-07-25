import { tags } from 'typia';
import { ICompetition } from './competition.interface';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 *  RequiredAdditionalInfo.
 *
 * 대회신청시 추가 정보 입력 규칙.
 * - 대회사가 요청한경우에만 해당 Entity를 생성합니다.
 */
export interface IRequiredAdditionalInfo {
  /** UUID v7. */
  id: TId;

  /**
   * 추가정보 타입가
   *
   * - SOCIAL_SECURITY_NUMBER : 주민등록번호
   * - ADDRESS : 주소
   */
  type: 'SOCIAL_SECURITY_NUMBER' | 'ADDRESS';

  /**
   * 추가정보 설명.
   * - 추가 정보를 수집하는 이유등을 설명합니다등
   */
  description: string & tags.MinLength<1> & tags.MaxLength<512>;

  /** createdAt. */
  createdAt: TDateOrStringDate;

  /** deletedAt*/
  deletedAt: TDateOrStringDate | null;

  /** competitionId  */
  competitionId: ICompetition['id'];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IRequiredAdditionalInfoModelData extends IRequiredAdditionalInfo {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IRequiredAdditionalInfoCreateDto
  extends Pick<IRequiredAdditionalInfo, 'type' | 'description' | 'competitionId'> {}

export interface IRequiredAdditionalInfoUpdateDto
  extends Pick<IRequiredAdditionalInfo, 'id' | 'description' | 'competitionId'> {}
