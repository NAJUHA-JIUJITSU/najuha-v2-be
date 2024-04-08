import { IPolicy } from '../../domain/interface/policy.interface';

export type CreatePolicyReqDto = Pick<IPolicy, 'type' | 'isMandatory' | 'title' | 'content'>;
