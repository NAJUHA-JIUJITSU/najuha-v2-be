import { PolicyEntity } from 'src/infrastructure/database/entities/policy.entity';

export type CreatePolicyReqDto = Pick<PolicyEntity, 'type' | 'isMandatory' | 'title' | 'content'>;
