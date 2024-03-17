import { Policy } from 'src/modules/policy/domain/policy.entity';

export type UpdatePolicyReqDto = Partial<Pick<Policy, 'type' | 'title' | 'content'>>;
