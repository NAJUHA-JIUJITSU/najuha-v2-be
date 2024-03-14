import { Injectable } from '@nestjs/common';
import { CreatePolicyReqDto } from '../dto/request/create-policy.req.dto';
import { PolicyRepository } from '../../../infrastructure/database/repositories/policy.repository';
import { IPolicy } from 'src/interfaces/policy.interface';
import { FindAllPoliciesResDto } from '../dto/response/find-all-policies.res.dto';
import { FindOnePolicyResDto } from '../dto/response/find-one-policy.res.dto';
import { GetOnePolicyResDto } from '../dto/response/get-one-policy.res.dto';

@Injectable()
export class PolicyAppService {
  constructor(private readonly policyRepository: PolicyRepository) {}

  async createPolicy(CreatePolicyReqDto: CreatePolicyReqDto): Promise<GetOnePolicyResDto> {
    // 같은 타입의 약관이 이미 존재하는지 확인, 가장 최근에 등록된 약관을 가져을
    // TODO: domain service 로 분리
    const existingPolicy = await this.policyRepository.findOne({
      where: { type: CreatePolicyReqDto.type },
      order: { createdAt: 'DESC' },
    });
    // 같은 타입의 약관이 존재하면 버전을 1 증가시킴
    const newVersion = existingPolicy ? existingPolicy.version + 1 : 1;
    const newPolicy = this.policyRepository.create({
      ...CreatePolicyReqDto,
      version: newVersion,
    });
    return await this.policyRepository.save(newPolicy);
  }

  // TODO content 는 제외
  async findAllPolicies(type?: IPolicy['type']): Promise<FindAllPoliciesResDto> {
    return this.policyRepository.find({ where: { type } });
  }

  async findOnePolicy(id: number): Promise<FindOnePolicyResDto> {
    return this.policyRepository.findOne({ where: { id } });
  }

  // TODO content 는 제외
  async findAllTypesOfLatestPolicies(): Promise<FindAllPoliciesResDto> {
    return this.policyRepository.findAllTypesOfLatestPolicies();
  }
}
