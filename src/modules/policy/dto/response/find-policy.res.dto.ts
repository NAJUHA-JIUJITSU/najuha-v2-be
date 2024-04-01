import { IPolicy } from '../../domain/structure/policy.interface';

export interface FindPolicyResDto {
  policy: IPolicy | null;
}
