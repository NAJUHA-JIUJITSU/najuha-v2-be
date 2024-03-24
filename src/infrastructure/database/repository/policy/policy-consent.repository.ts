import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PolicyConsent } from 'src/infrastructure/database/entities/policy/policy-consent.entity';
// import { BusinessException } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';

// TODO: 에러 표준화
// @Injectable()
// export class PolicyConsentRepository extends Repository<PolicyConsent> {
//   constructor(private dataSource: DataSource) {
//     super(PolicyConsent, dataSource.createManager());
//   }

//   async saveOrFail(dto: Pick<PolicyConsent, 'id'> & Partial<PolicyConsent>): Promise<PolicyConsent> {
//     const policyConsent = await this.findOne({ where: { id: dto.id } });
//     if (!policyConsent) throw new Error('PolicyConsent not found');
//     return await this.save({ ...policyConsent, ...dto });
//   }

//   async updateOrFail(dto: Pick<PolicyConsent, 'id'> & Partial<PolicyConsent>): Promise<void> {
//     const result = await this.update({ id: dto.id }, dto);
//     if (!result.affected) throw new Error('PolicyConsent not found');
//   }

//   async getOneOrFail({ where, relations }: FindOneOptions<PolicyConsent>): Promise<PolicyConsent> {
//     const policyConsent = await this.findOne({ where, relations });
//     if (!policyConsent) throw new Error('PolicyConsent not found');
//     return policyConsent;
//   }
// }

@Injectable()
export class PolicyConsentRepository {
  constructor(
    @InjectRepository(PolicyConsent)
    private readonly policyConsentRepository: Repository<PolicyConsent>,
  ) {}

  async createPolicyConsents(dto: PolicyConsent[]): Promise<PolicyConsent[]> {
    const policyConsent = this.policyConsentRepository.create(dto);
    return this.policyConsentRepository.save(policyConsent);
  }
}
