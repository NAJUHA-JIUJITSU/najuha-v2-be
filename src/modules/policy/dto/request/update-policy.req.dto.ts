import { PolicyEntity } from 'src/modules/policy/domain/policy.entity';

export type UpdatePolicyReqDto = Partial<Pick<PolicyEntity, 'type' | 'title' | 'content'>>;
