import { IPolicy } from '../../policy.interface';

export type UpdatePolicyReqDto = Partial<Pick<IPolicy, 'type' | 'title' | 'content'>>;
