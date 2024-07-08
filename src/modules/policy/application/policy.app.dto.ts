import { IPolicy, IPolicyCreateDto, IPolicyDetail, IPolicySummery } from '../domain/interface/policy.interface';

// ---------------------------------------------------------------------------
// policyAppService Param
// ---------------------------------------------------------------------------
export interface CreatePolicyParam {
  policyCreateDto: IPolicyCreateDto;
}

export interface FindPoliciesParam {
  type?: IPolicy['type'];
}

export interface FindPolicyParam {
  policyId: IPolicy['id'];
}

// ---------------------------------------------------------------------------
// policyAppService Result
// ---------------------------------------------------------------------------
export interface CreatePolicyRet {
  policy: IPolicyDetail;
}

export interface FindPoliciesRet {
  policies: IPolicySummery[];
}

export interface GetPolicyRet {
  policy: IPolicyDetail;
}

export interface FindAllTypesOfLatestPoliciesRet {
  policies: IPolicySummery[];
}
