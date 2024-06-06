import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import {
  CreatePolicyParam,
  CreatePolicyRet,
  FindAllTypesOfLatestPoliciesRet,
  FindPoliciesParam,
  FindPoliciesRet,
  FindPolicyParam,
  GetPolicyRet,
} from './policy.app.dto';
import { PolicyRepository } from 'src//database/custom-repository/policy.repository';
import { BusinessException, CommonErrors } from 'src/common/response/errorResponse';

@Injectable()
export class PolicyAppService {
  constructor(private readonly policyRepository: PolicyRepository) {}

  async createPolicy({ policyCreateDto }: CreatePolicyParam): Promise<CreatePolicyRet> {
    const existingPolicyEntity = await this.policyRepository.findOne({
      where: { type: policyCreateDto.type },
      order: { createdAt: 'DESC' },
    });

    // 같은 타입의 약관이 존재하면 버전을 1 증가시킴
    const newVersion = existingPolicyEntity ? existingPolicyEntity.version + 1 : 1;
    const policyEntity = await this.policyRepository.save({
      id: uuidv7(),
      type: policyCreateDto.type,
      isMandatory: policyCreateDto.isMandatory,
      title: policyCreateDto.title,
      content: policyCreateDto.content,
      version: newVersion,
      createdAt: new Date(),
    });
    return { policy: policyEntity };
  }

  async findPolicies({ type }: FindPoliciesParam): Promise<FindPoliciesRet> {
    const policies = await this.policyRepository.find({
      where: { type },
      select: ['id', 'version', 'type', 'isMandatory', 'title', 'createdAt'],
    });
    return { policies };
  }

  async getPolicy({ policyId }: FindPolicyParam): Promise<GetPolicyRet> {
    const policy = await this.policyRepository.findOneOrFail({ where: { id: policyId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Policy not found');
    });
    return { policy };
  }

  async findAllTypesOfLatestPolicies(): Promise<FindAllTypesOfLatestPoliciesRet> {
    const policies = await this.policyRepository.findAllTypesOfLatestPolicies();
    return { policies };
  }
}
