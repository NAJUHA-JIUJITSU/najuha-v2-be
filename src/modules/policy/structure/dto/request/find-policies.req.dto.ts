import { Policy } from 'src/modules/policy/domain/entities/policy.entity';

export type FindPoliciesReqDto = { type?: Policy['type'] };
