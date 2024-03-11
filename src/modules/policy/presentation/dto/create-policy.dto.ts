import { IPolicy } from 'src/interfaces/policy.interface';

export type CreatePolicyDto = Pick<IPolicy, 'type' | 'isMandatory' | 'title' | 'content'>;
