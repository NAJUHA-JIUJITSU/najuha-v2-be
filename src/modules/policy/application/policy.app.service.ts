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
import { assert } from 'typia';
import { uuidv7 } from 'uuidv7';

@Injectable()
export class PolicyAppService {
  constructor(private readonly policyRepository: PolicyRepository) {}

  async createPolicy({ policyCreateDto }: CreatePolicyParam): Promise<CreatePolicyRet> {
    const existingPolicyCount = await this.policyRepository.count({ where: { type: policyCreateDto.type } });

    const newPolicyModelData = {
      id: uuidv7(),
      createdAt: new Date(),
      version: existingPolicyCount + 1,
      type: policyCreateDto.type,
      isMandatory: policyCreateDto.isMandatory,
      title: policyCreateDto.title,
      content: policyCreateDto.content,
    };

    return assert<CreatePolicyRet>({ policy: await this.policyRepository.save(newPolicyModelData) });
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
