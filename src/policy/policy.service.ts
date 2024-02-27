import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PolicyEntity } from 'src/policy/entities/policy.entity';
import { CreatePolicyDto } from './dto/create-policy.dto';

@Injectable()
export class PolicyService {
  constructor(
    @InjectRepository(PolicyEntity)
    private policyRepository: Repository<PolicyEntity>,
  ) {}

  async createPolicy(createPolicyDto: CreatePolicyDto): Promise<PolicyEntity> {
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
  async findAllPolicies(type?: PolicyEntity['type']): Promise<PolicyEntity[]> {
    return this.policyRepository.find({ where: { type } });
  }

  async findPolicy(id: number): Promise<PolicyEntity | null> {
    return this.policyRepository.findOne({ where: { id } });
  }

  // TODO content 는 제외
  async findAllTypesOfRecentPolicies(): Promise<PolicyEntity[]> {
    // 모든 타입의 가장 최근에 등록된 약관을 가져옴
    return this.policyRepository
      .createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }
}
