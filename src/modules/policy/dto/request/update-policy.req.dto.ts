import { IPolicy } from '../../domain/interface/policy.interface';

export type UpdatePolicyReqDto = Partial<Pick<IPolicy, 'type' | 'title' | 'content'>>;
