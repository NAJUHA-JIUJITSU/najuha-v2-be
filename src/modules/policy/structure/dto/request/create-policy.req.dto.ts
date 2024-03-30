import { IPolicy } from '../../../domain/policy.interface';

export type CreatePolicyReqDto = Pick<IPolicy, 'type' | 'isMandatory' | 'title' | 'content'>;
