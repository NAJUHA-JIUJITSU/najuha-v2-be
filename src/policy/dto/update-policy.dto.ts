import { PolicyEntity } from 'src/policy/entities/policy.entity';

export type UpdatePolicyDto = Partial<Pick<PolicyEntity, 'type' | 'title' | 'content'>>;
