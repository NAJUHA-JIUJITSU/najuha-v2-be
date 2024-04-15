import { FindOneOptions, Repository } from 'typeorm';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PolicyTable } from '../../infrastructure/database/tables/policy/policy.entity';
import { PolicyConsentTable } from '../../infrastructure/database/tables/user/policy-consent.entity';
import { UserTable } from '../../infrastructure/database/tables/user/user.entity';
import { IRegisterUser } from './domain/interface/register-user.interface';
import { IPolicy } from '../policy/domain/interface/policy.interface';
import { IPolicyConsent } from './domain/interface/policy-consent.interface';

@Injectable()
export class RegisterRepository {
  constructor(
    @InjectRepository(UserTable)
    private readonly userRepository: Repository<UserTable>,
    @InjectRepository(PolicyTable)
    private readonly policyRepository: Repository<PolicyTable>,
    @InjectRepository(PolicyConsentTable)
    private readonly policyConsentRepository: Repository<PolicyConsentTable>,
  ) {}

  // ------------------ User ------------------
  async findUser({ where, relations }: FindOneOptions<IRegisterUser>): Promise<IRegisterUser | null> {
    return this.userRepository.findOne({ where, relations });
  }

  async getUser(options?: { where: Partial<Pick<IRegisterUser, 'id'>>; relations?: string[] }): Promise<IRegisterUser> {
    const user = await this.userRepository.findOne({ where: options?.where, relations: options?.relations });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return user;
  }

  async updateUser(dto: Pick<IRegisterUser, 'id'> & Partial<IRegisterUser>): Promise<void> {
    const result = await this.userRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
  }

  // ------------------ Policy ------------------
  async findAllTypesOfLatestPolicies(): Promise<IPolicy[]> {
    return this.policyRepository
      .createQueryBuilder('policy')
      .distinctOn(['policy.type'])
      .orderBy('policy.type')
      .addOrderBy('policy.createdAt', 'DESC')
      .getMany();
  }

  async findAllMandatoryPolicies(): Promise<IPolicy[]> {
    return this.findAllTypesOfLatestPolicies().then((policies) => policies.filter((policy) => policy.isMandatory));
  }

  // ------------------ PolicyConsent ------------------
  async createPolicyConsents(dto: IPolicyConsent[]): Promise<IPolicyConsent[]> {
    const policyConsent = this.policyConsentRepository.create(dto);
    return this.policyConsentRepository.save(policyConsent);
  }
}
