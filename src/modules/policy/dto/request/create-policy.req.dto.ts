import { Policy } from 'src/infrastructure/database/entities/policy/policy.entity';

export type CreatePolicyReqDto = Pick<Policy, 'type' | 'isMandatory' | 'title' | 'content'>;
