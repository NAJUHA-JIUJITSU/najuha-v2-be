import { PolicyEntity } from 'src/policy/entities/policy.entity';

export type CreatePolicyDto = Pick<PolicyEntity, 'type' | 'isMandatory' | 'title' | 'content'>;
