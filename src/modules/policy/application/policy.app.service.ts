import { Injectable } from '@nestjs/common';
import { CreatePolicyDto } from '../presentation/dto/create-policy.dto';
import { PolicyRepository } from '../../../infrastructure/database/repositories/policy.repository';
import { IPolicy } from 'src/interfaces/policy.interface';

@Injectable()
export class PolicyAppService {
  constructor(private readonly policyRepository: PolicyRepository) {}

  async createPolicy(createPolicyDto: CreatePolicyDto): Promise<IPolicy> {
    // 같은 타입의 약관이 이미 존재하는지 확인, 가장 최근에 등록된 약관을 가져을
    const existingPolicy = await this.policyRepository.findOne({
      where: { type: createPolicyDto.type },
      order: { createdAt: 'DESC' },
    });
    // 같은 타입의 약관이 존재하면 버전을 1 증가시킴
    const newVersion = existingPolicy ? existingPolicy.version + 1 : 1;
    const newPolicy = this.policyRepository.create({
      ...createPolicyDto,
      version: newVersion,
    });
    return await this.policyRepository.save(newPolicy);
  }

  // TODO content 는 제외
  async findAllPolicies(type?: IPolicy['type']): Promise<IPolicy[]> {
    return this.policyRepository.find({ where: { type } });
  }

  async findOnePolicy(id: number): Promise<IPolicy | null> {
    return this.policyRepository.findOne({ where: { id } });
  }

  // TODO content 는 제외
  async findAllTypesOfLatestPolicies(): Promise<IPolicy[]> {
    return this.policyRepository.findAllTypesOfLatestPolicies();
  }
}
