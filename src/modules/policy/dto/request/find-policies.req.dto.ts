import { PolicyEntity } from 'src/modules/policy/domain/policy.entity';

export type FindPoliciesReqDto = { type?: PolicyEntity['type'] };
