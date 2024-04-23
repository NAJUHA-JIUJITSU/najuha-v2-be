import { IPolicy } from '../domain/interface/policy.interface';

// Application Layer Param Dtos ----------------------------------------------
export interface CreatePolicyParam {
  policyCreateDto: Pick<IPolicy, 'type' | 'isMandatory' | 'title' | 'content'>;
}

export interface FindPoliciesParam {
  type?: IPolicy['type'];
}

export interface FindPolicyParam {
  id: IPolicy['id'];
}

// Application Layer Result Dtos ----------------------------------------------
export interface CreatePolicyRet {
  policy: IPolicy;
}

export interface FindPoliciesRet {
  policies: IPolicy[];
}

export interface FindPolicyRet {
  policy: IPolicy | null;
}

export interface FindAllTypesOfLatestPoliciesRet {
  policies: IPolicy[];
}
