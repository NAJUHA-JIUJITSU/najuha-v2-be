import { IPolicy } from 'src/interfaces/policy.interface';

export type UpdatePolicyReqDto = Partial<Pick<IPolicy, 'type' | 'title' | 'content'>>;
