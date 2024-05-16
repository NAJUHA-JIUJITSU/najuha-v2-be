import { tags } from 'typia';
import { IApplication } from './application.interface';
import { IRequiredAdditionalInfo } from 'src/modules/competitions/domain/interface/required-addtional-info.interface';
import { DateOrStringDate } from 'src/common/common-types';

export interface IAdditionalInfo {
  /** UUIDv7. */
  id: string & tags.MinLength<36> & tags.MaxLength<36>;

  /**  Created at. */
  createdAt: DateOrStringDate;

  /** Updated at. */
  updatedAt: DateOrStringDate;

  /** Type. */
  type: IRequiredAdditionalInfo['type'];

  /** Value. */
  value: string;

  /** Application id. */
  applicationId: IApplication['id'];
}

export type IAdditionalInfoCreateDto = SocialScurityNumberInfo | AddressInfo;
export type IAdditionalInfoUpdateDto = SocialScurityNumberInfo | AddressInfo;

export type SocialScurityNumberInfo = {
  type: 'SOCIAL_SECURITY_NUMBER';
  value: string & tags.Pattern<'^[0-9]{6}-[0-9]{7}$'>;
};

export type AddressInfo = {
  type: 'ADDRESS';
  value: string & tags.MinLength<1> & tags.MaxLength<512>;
};