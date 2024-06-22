import { Injectable } from '@nestjs/common';
import {
  CreatePolicyParam,
  CreatePolicyRet,
  FindAllTypesOfLatestPoliciesRet,
  FindPoliciesParam,
  FindPoliciesRet,
  FindPolicyParam,
  GetPolicyRet,
} from './policy.app.dto';
import { PolicyRepository } from '../../../database/custom-repository/policy.repository';
import { BusinessException, CommonErrors } from '../../../common/response/errorResponse';
import { PolicyModel } from '../domain/model/policy.model';
import { assert } from 'typia';

@Injectable()
export class PolicyAppService {
  constructor(private readonly policyRepository: PolicyRepository) {}

  async createPolicy(param: CreatePolicyParam): Promise<CreatePolicyRet> {
    const existingPolicyCount = await this.policyRepository.count({ where: { type: param.type } });

    const newPolicyModel = PolicyModel.create({
      version: existingPolicyCount + 1,
      type: param.type,
      isMandatory: param.isMandatory,
      title: param.title,
      content: param.content,
    });

    return assert<CreatePolicyRet>({ policy: await this.policyRepository.save(newPolicyModel.toData()) });
  }

  async findPolicies({ type }: FindPoliciesParam): Promise<FindPoliciesRet> {
    const policies = await this.policyRepository.find({
      where: { type },
      select: ['id', 'version', 'type', 'isMandatory', 'title', 'createdAt'],
    });
    return assert<FindPoliciesRet>({ policies });
  }

  async getPolicy({ policyId }: FindPolicyParam): Promise<GetPolicyRet> {
    const policy = await this.policyRepository.findOneOrFail({ where: { id: policyId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Policy not found');
    });
    return assert<GetPolicyRet>({ policy });
  }

  async findAllTypesOfLatestPolicies(): Promise<FindAllTypesOfLatestPoliciesRet> {
    const policies = await this.policyRepository.findAllTypesOfLatestPolicies();
    return assert<FindAllTypesOfLatestPoliciesRet>({ policies });
  }
}
