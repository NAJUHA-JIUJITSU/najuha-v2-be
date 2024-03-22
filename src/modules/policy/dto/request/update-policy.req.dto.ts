import { PolicyEntity } from 'src/infrastructure/database/entities/policy/policy.entity';

export type UpdatePolicyReqDto = Partial<Pick<PolicyEntity, 'type' | 'title' | 'content'>>;
