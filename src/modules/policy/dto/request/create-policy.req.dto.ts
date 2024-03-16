import { PolicyEntity } from 'src/modules/policy/domain/policy.entity';

export type CreatePolicyReqDto = Pick<PolicyEntity, 'type' | 'isMandatory' | 'title' | 'content'>;
