import { OmitOptional } from 'src/common/omit-optional.type';
import { Policy } from 'src/infrastructure/database/entities/policy/policy.entity';

export type FindPoliciesResDto = OmitOptional<Policy>[];
