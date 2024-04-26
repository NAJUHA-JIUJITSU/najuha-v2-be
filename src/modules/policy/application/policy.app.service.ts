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
import { InjectRepository } from '@nestjs/typeorm';
import { PolicyEntity } from 'src/infrastructure/database/entity/policy/policy.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PolicyAppService {
  constructor(
    @InjectRepository(PolicyEntity)
    private readonly policyRepository: Repository<PolicyEntity>,
  ) {}

  async createPolicy({ policyCreateDto }: CreatePolicyParam): Promise<CreatePolicyRet> {
    const existingPolicyEntity = await this.policyRepository.findOne({
      where: { type: policyCreateDto.type },
      order: { createdAt: 'DESC' },
    });

    // 같은 타입의 약관이 존재하면 버전을 1 증가시킴
    const newVersion = existingPolicyEntity ? existingPolicyEntity.version + 1 : 1;
    const policyEntity = this.policyRepository.create({
      id: ulid(),
      ...policyCreateDto,
      version: newVersion,
    });
    return { policy: policyEntity };
  }

  // TODO content 는 제외
  async findPolicies({ type }: FindPoliciesParam): Promise<FindPoliciesRet> {
    const policies = await this.policyRepository.find({ where: { type } });
    return { policies };
  }

  async findPolicy({ id }: FindPolicyParam): Promise<FindPolicyRet> {
    const policy = await this.policyRepository.findOne({ where: { id } });
    return { policy };
  }

  // TODO content 는 제외
  async findAllTypesOfLatestPolicies(): Promise<FindAllTypesOfLatestPoliciesRet> {
    // findAllTypesOfLatestPolicies
    const policies = await this.policyRepository
      .createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
    return { policies };
  }
}
