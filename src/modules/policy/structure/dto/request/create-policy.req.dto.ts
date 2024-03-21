import { IPolicy } from '../../policy.interface';

export type CreatePolicyReqDto = Pick<IPolicy, 'type' | 'isMandatory' | 'title' | 'content'>;
