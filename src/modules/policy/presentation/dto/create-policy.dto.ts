import { PolicyEntity } from 'src/infrastructure/database/entities/policy.entity';

export type CreatePolicyDto = Pick<PolicyEntity, 'type' | 'isMandatory' | 'title' | 'content'>;
