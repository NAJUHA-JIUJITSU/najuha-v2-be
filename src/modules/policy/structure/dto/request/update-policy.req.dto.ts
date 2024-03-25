import { Policy } from 'src/modules/policy/domain/entities/policy.entity';

export type UpdatePolicyReqDto = Partial<Pick<Policy, 'type' | 'title' | 'content'>>;
