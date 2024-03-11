import { PolicyEntity } from 'src/infrastructure/database/entities/policy.entity';

export type UpdatePolicyDto = Partial<Pick<PolicyEntity, 'type' | 'title' | 'content'>>;
