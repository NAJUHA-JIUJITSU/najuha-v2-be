import { PolicyEntity } from 'src/infrastructure/database/entities/policy.entity';

export type FindPoliciesReqDto = { type?: PolicyEntity['type'] };
