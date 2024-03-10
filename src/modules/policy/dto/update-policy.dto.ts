import { PolicyEntity } from 'src/infra/database/entities/policy.entity';

export type UpdatePolicyDto = Partial<Pick<PolicyEntity, 'type' | 'title' | 'content'>>;
