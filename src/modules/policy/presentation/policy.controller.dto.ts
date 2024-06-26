import {
  CreatePolicyRet,
  FindAllTypesOfLatestPoliciesRet,
  FindPoliciesRet,
  GetPolicyRet,
} from '../application/policy.app.dto';
import { IPolicy, IPolicyCreateDto } from '../domain/interface/policy.interface';

// ---------------------------------------------------------------------------
// policyController Request
// ---------------------------------------------------------------------------
export interface CreatePolicyReqBody extends IPolicyCreateDto {}

export interface FindPoliciesReqQuery {
  type?: IPolicy['type'];
}

// ---------------------------------------------------------------------------
// policyController Response
// ---------------------------------------------------------------------------
export interface CreatePolicyRes extends CreatePolicyRet {}

export interface FindPoliciesRes extends FindPoliciesRet {}

export interface GetPolicyRes extends GetPolicyRet {}

export interface FindAllTypesOfLatestPoliciesRes extends FindAllTypesOfLatestPoliciesRet {}
