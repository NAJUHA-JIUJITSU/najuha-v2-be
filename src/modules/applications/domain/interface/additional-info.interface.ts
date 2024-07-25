import { tags } from 'typia';
import { IApplication } from './application.interface';
import { IRequiredAdditionalInfo } from '../../../competitions/domain/interface/required-additional-info.interface';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * AdditionalInfo.
 *
 * 대회사가 참가자에게 요구하는 추가 정보. ex) 주소, 주민등록번호 등
 * 대회사가 요청하지 않은경우 추가 정보를 입력하지 않아도 된다.
 */
export interface IAdditionalInfo {
  /** UUID v7. */
  id: TId;

  /** createdAt.*/
  createdAt: TDateOrStringDate;

  updatedAt: TDateOrStringDate;

  /**
   * type.
   * - SOCIAL_SECURITY_NUMBER: 주민등록번호
   * - ADDRESS: 주소
   */
  type: IRequiredAdditionalInfo['type'];

  /**
   * value. 각 type에 해당하는 값.
   * - SOCIAL_SECURITY_NUMBER: '123456-1234567'
   * - ADDRESS: '서울시 강남구 테헤란로 123'
   */
  value: string;

  /** Application id. */
  applicationId: IApplication['id'];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IAdditionalInfoModelData extends IAdditionalInfo {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export type IAdditionalInfoCreateDto = SocialScurityNumberInfo | AddressInfo;
export type IAdditionalInfoUpdateDto = SocialScurityNumberInfo | AddressInfo;

// ----------------------------------------------------------------------------
// Custom Types
// ----------------------------------------------------------------------------
export type SocialScurityNumberInfo = {
  type: 'SOCIAL_SECURITY_NUMBER';
  value: string & tags.Pattern<'^[0-9]{6}-[0-9]{7}$'>;
};

export type AddressInfo = {
  type: 'ADDRESS';
  value: string & tags.MinLength<1> & tags.MaxLength<512>;
};
