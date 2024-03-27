import { IPolicy } from '../../interface/policy.interface';

export type CreatePolicyReqDto = Pick<IPolicy, 'type' | 'isMandatory' | 'title' | 'content'>;
