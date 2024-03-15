import { PolicyEntity } from 'src/infrastructure/database/entities/policy.entity';

export type UpdatePolicyReqDto = Partial<Pick<PolicyEntity, 'type' | 'title' | 'content'>>;
