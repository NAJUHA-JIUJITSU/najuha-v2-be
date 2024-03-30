import { Injectable } from '@nestjs/common';
import { CreatePolicyReqDto } from '../structure/dto/request/create-policy.req.dto';
import { PolicyRepository } from '../policy.repository';
import { Policy } from 'src/infrastructure/database/entities/policy/policy.entity';

@Injectable()
export class PolicyAppService {
  constructor(private readonly policyRepository: PolicyRepository) {}

  async createPolicy(CreatePolicyReqDto: CreatePolicyReqDto): Promise<Policy> {
    // 같은 타입의 약관이 이미 존재하는지 확인, 가장 최근에 등록된 약관을 가져을
    // TODO: domain service 로 분리
    const existingPolicy = await this.policyRepository.findPolicy({
      where: { type: CreatePolicyReqDto.type },
      order: { createdAt: 'DESC' },
    });
    // 같은 타입의 약관이 존재하면 버전을 1 증가시킴
    const newVersion = existingPolicy ? existingPolicy.version + 1 : 1;
    return await this.policyRepository.createPolicy({
      ...CreatePolicyReqDto,
      version: newVersion,
    });
  }

  // TODO content 는 제외
  async findPolicies(type?: Policy['type']): Promise<Policy[]> {
    return this.policyRepository.findPolicies({ where: { type } });
  }

  async findPolicy(id: number): Promise<Policy | null> {
    return this.policyRepository.findPolicy({ where: { id } });
  }

  // TODO content 는 제외
  async findAllTypesOfLatestPolicies(): Promise<Policy[]> {
    return this.policyRepository.findAllTypesOfLatestPolicies();
  }
}
