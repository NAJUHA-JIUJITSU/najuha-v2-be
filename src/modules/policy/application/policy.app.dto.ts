import { IPolicy, IPolicyFindMany } from '../domain/interface/policy.interface';

// ---------------------------------------------------------------------------
// policyAppService Param
// ---------------------------------------------------------------------------
export interface CreatePolicyParam {
  policyCreateDto: Pick<IPolicy, 'type' | 'isMandatory' | 'title' | 'content'>;
}

export interface FindPoliciesParam {
  type?: IPolicy['type'];
}

export interface FindPolicyParam {
  id: IPolicy['id'];
}

// ---------------------------------------------------------------------------
// policyAppService Result
// ---------------------------------------------------------------------------
export interface CreatePolicyRet {
  policy: IPolicy;
}

export interface FindPoliciesRet {
  policies: IPolicyFindMany[];
}

export interface GetPolicyRet {
  policy: IPolicy;
}

export interface FindAllTypesOfLatestPoliciesRet {
  policies: IPolicyFindMany[];
}
