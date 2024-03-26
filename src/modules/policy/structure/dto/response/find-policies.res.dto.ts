import { OmitOptional } from 'src/common/omit-optional.type';
import { Policy } from 'src/modules/policy/domain/entities/policy.entity';

export interface FindPoliciesResDto {
  policies: OmitOptional<Policy>[];
}
