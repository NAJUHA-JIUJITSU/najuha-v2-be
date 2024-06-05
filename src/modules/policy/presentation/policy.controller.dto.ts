import {
  CreatePolicyParam,
  CreatePolicyRet,
  FindAllTypesOfLatestPoliciesRet,
  FindPoliciesRet,
  FindPolicyRet,
} from '../application/policy.app.dto';
import { IPolicy } from '../domain/interface/policy.interface';

// ---------------------------------------------------------------------------
// policyController Request
// ---------------------------------------------------------------------------
export interface CreatePolicyReqBody extends Pick<IPolicy, 'type' | 'isMandatory' | 'title' | 'content'> {}

export interface FindPoliciesReqQuery {
  type?: IPolicy['type'];
}

// ---------------------------------------------------------------------------
// policyController Response
// ---------------------------------------------------------------------------
export interface CreatePolicyRes extends CreatePolicyRet {}

export interface FindPoliciesRes extends FindPoliciesRet {}

export interface FindPolicyRes extends FindPolicyRet {}

export interface FindAllRecentPoliciesRes extends FindAllTypesOfLatestPoliciesRet {}
