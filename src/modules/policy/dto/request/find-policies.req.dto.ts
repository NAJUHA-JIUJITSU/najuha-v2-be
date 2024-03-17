import { Policy } from 'src/modules/policy/domain/policy.entity';

export type FindPoliciesReqDto = { type?: Policy['type'] };
