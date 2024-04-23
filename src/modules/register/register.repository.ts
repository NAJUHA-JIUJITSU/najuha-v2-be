import { FindOneOptions, Repository } from 'typeorm';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PolicyEntity } from '../../infrastructure/database/entity/policy/policy.entity';
import { PolicyConsentEntity } from '../../infrastructure/database/entity/user/policy-consent.entity';
import { UserEntity } from '../../infrastructure/database/entity/user/user.entity';
import { IPolicy } from '../policy/domain/interface/policy.interface';
import { IPolicyConsent } from './domain/interface/policy-consent.interface';
import { IUser } from '../users/domain/interface/user.interface';
import { assert } from 'typia';

// TODO : 구체적 Entity 사용하기
@Injectable()
export class RegisterRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PolicyEntity)
    private readonly policyRepository: Repository<PolicyEntity>,
    @InjectRepository(PolicyConsentEntity)
    private readonly policyConsentRepository: Repository<PolicyConsentEntity>,
  ) {}

  // ------------------ User ------------------
  async findUser({ where, relations }: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where, relations });
  }

  async getTemporaryUser(userId: IUser['id']): Promise<IUser.Entity.TemporaryUser> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return assert<IUser.Entity.TemporaryUser>(user);
  }

  async getRegisterUser(userId: IUser['id']): Promise<IUser.Entity.RegisterUser> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['policyConsents'] });
    if (!user) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'User not found');
    return assert<IUser.Entity.RegisterUser>(user);
  }

  async saveUser(entity: IUser.Entity.RegisterUser): Promise<IUser.Entity.RegisterUser> {
    const user = await this.userRepository.save(entity);
    return assert<IUser.Entity.RegisterUser>(user);
  }

  async updateUser(dto: Pick<UserEntity, 'id'> & Partial<UserEntity>): Promise<void> {
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
