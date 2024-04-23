import {
  CreatePolicyParam,
  CreatePolicyRet,
  FindAllTypesOfLatestPoliciesRet,
  FindPoliciesRet,
  FindPolicyRet,
} from '../application/dtos';
import { IPolicy } from '../domain/interface/policy.interface';

// Presentation Layer Request DTOs
export type CreatePolicyReqBody = CreatePolicyParam['policyCreateDto'];

export interface FindPoliciesReqQuery {
  type?: IPolicy['type'];
}

// Presentation Layer Response DTOs
export interface CreatePolicyRes extends CreatePolicyRet {}

export interface FindPoliciesRes extends FindPoliciesRet {}

export interface FindPolicyRes extends FindPolicyRet {}

export interface FindAllRecentPoliciesRes extends FindAllTypesOfLatestPoliciesRet {}
