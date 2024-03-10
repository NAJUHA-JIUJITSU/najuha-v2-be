import { PolicyEntity } from 'src/infra/database/entities/policy.entity';

export type CreatePolicyDto = Pick<PolicyEntity, 'type' | 'isMandatory' | 'title' | 'content'>;
