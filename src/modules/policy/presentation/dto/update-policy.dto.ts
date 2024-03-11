import { IPolicy } from 'src/interfaces/policy.interface';

export type UpdatePolicyDto = Partial<Pick<IPolicy, 'type' | 'title' | 'content'>>;
