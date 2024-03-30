import { IPolicy } from '../../../domain/policy.interface';

export type UpdatePolicyReqDto = Partial<Pick<IPolicy, 'type' | 'title' | 'content'>>;
