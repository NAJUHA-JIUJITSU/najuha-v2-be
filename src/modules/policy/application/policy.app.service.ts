import { Injectable } from '@nestjs/common';
import { PolicyRepository } from '../policy.repository';
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

@Injectable()
export class PolicyAppService {
  constructor(private readonly policyRepository: PolicyRepository) {}

  async createPolicy({ policyCreateDto }: CreatePolicyParam): Promise<CreatePolicyRet> {
    // 같은 타입의 약관이 이미 존재하는지 확인, 가장 최근에 등록된 약관을 가져을
    const existingPolicy = await this.policyRepository.findPolicy({
      where: { type: policyCreateDto.type },
      order: { createdAt: 'DESC' },
    });
    // 같은 타입의 약관이 존재하면 버전을 1 증가시킴
    const newVersion = existingPolicy ? existingPolicy.version + 1 : 1;
    const policy = await this.policyRepository.createPolicy({
      id: ulid(),
      ...policyCreateDto,
      version: newVersion,
    });
    return { policy };
  }

  // TODO content 는 제외
  async findPolicies({ type }: FindPoliciesParam): Promise<FindPoliciesRet> {
    const policies = await this.policyRepository.findPolicies({ where: { type } });
    return { policies };
  }

  async findPolicy({ id }: FindPolicyParam): Promise<FindPolicyRet> {
    const policy = await this.policyRepository.findPolicy({ where: { id } });
    return { policy };
  }

  // TODO content 는 제외
  async findAllTypesOfLatestPolicies(): Promise<FindAllTypesOfLatestPoliciesRet> {
    const policies = await this.policyRepository.findAllTypesOfLatestPolicies();
    return { policies };
  }
}
