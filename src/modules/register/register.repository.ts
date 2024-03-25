import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../users/domain/entities/user.entity';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Policy } from '../policy/domain/entities/policy.entity';
import { PolicyConsent } from '../users/domain/entities/policy-consent.entity';

@Injectable()
export class RegisterRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
    @InjectRepository(PolicyConsent)
    private readonly policyConsentRepository: Repository<PolicyConsent>,
  ) {}

  // ------------------ User ------------------
  async findUser({ where, relations }: FindOneOptions<User>): Promise<User | null> {
    return await this.userRepository.findOne({ where, relations });
  }

  async getUser({ where, relations }: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where, relations });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return user;
  }

  async updateUser(dto: Pick<User, 'id'> & Partial<User>): Promise<void> {
    const result = await this.userRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
  }

  // ------------------ Policy ------------------
  async findAllTypesOfLatestPolicies(): Promise<Policy[]> {
    return this.policyRepository
      .createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }

  // ------------------ PolicyConsent ------------------
  async createPolicyConsents(dto: PolicyConsent[]): Promise<PolicyConsent[]> {
    const policyConsent = this.policyConsentRepository.create(dto);
    return this.policyConsentRepository.save(policyConsent);
  }
}
