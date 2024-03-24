import { Policy } from 'src/infrastructure/database/entities/policy/policy.entity';

export type UpdatePolicyReqDto = Partial<Pick<Policy, 'type' | 'title' | 'content'>>;
