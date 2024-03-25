import { Policy } from 'src/modules/policy/domain/entities/policy.entity';

export type CreatePolicyReqDto = Pick<Policy, 'type' | 'isMandatory' | 'title' | 'content'>;
