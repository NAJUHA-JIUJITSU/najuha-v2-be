import { Policy } from 'src/infrastructure/database/entities/policy/policy.entity';

export type FindPoliciesReqDto = { type?: Policy['type'] };
