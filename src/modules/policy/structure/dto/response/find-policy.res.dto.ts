import { IPolicy } from '../../../domain/policy.interface';

export interface FindPolicyResDto {
  policy: IPolicy | null;
}
