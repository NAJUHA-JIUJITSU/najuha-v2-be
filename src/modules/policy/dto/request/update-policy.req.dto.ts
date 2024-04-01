import { IPolicy } from '../../domain/structure/policy.interface';

export type UpdatePolicyReqDto = Partial<Pick<IPolicy, 'type' | 'title' | 'content'>>;
