import { IPolicy } from 'src/interfaces/policy.interface';

export type CreatePolicyReqDto = Pick<IPolicy, 'type' | 'isMandatory' | 'title' | 'content'>;
