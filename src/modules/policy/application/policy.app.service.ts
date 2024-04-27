import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import {
  CreatePolicyParam,
  CreatePolicyRet,
  FindAllTypesOfLatestPoliciesRet,
  FindPoliciesParam,
  FindPoliciesRet,
  FindPolicyParam,
  FindPolicyRet,
} from './dtos';
import { PolicyRepository } from 'src/infrastructure/database/custom-repository/policy.repository';

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
      id: ulid(),
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

  async findPolicy({ id }: FindPolicyParam): Promise<FindPolicyRet> {
    const policy = await this.policyRepository.findOne({ where: { id } });
    return { policy };
  }

  async findAllTypesOfLatestPolicies(): Promise<FindAllTypesOfLatestPoliciesRet> {
    const policies = await this.policyRepository.findAllTypesOfLatestPolicies();
    return { policies };
  }
}
