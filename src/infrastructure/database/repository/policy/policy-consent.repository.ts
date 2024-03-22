import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PolicyConsentEntity } from 'src/infrastructure/database/entities/policy/policy-consent.entity';
// import { BusinessException } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';

// TODO: 에러 표준화
// @Injectable()
// export class PolicyConsentRepository extends Repository<PolicyConsentEntity> {
//   constructor(private dataSource: DataSource) {
//     super(PolicyConsentEntity, dataSource.createEntityManager());
//   }

//   async saveOrFail(dto: Pick<PolicyConsentEntity, 'id'> & Partial<PolicyConsentEntity>): Promise<PolicyConsentEntity> {
//     const policyConsent = await this.findOne({ where: { id: dto.id } });
//     if (!policyConsent) throw new Error('PolicyConsentEntity not found');
//     return await this.save({ ...policyConsent, ...dto });
//   }

//   async updateOrFail(dto: Pick<PolicyConsentEntity, 'id'> & Partial<PolicyConsentEntity>): Promise<void> {
//     const result = await this.update({ id: dto.id }, dto);
//     if (!result.affected) throw new Error('PolicyConsentEntity not found');
//   }

//   async getOneOrFail({ where, relations }: FindOneOptions<PolicyConsentEntity>): Promise<PolicyConsentEntity> {
//     const policyConsent = await this.findOne({ where, relations });
//     if (!policyConsent) throw new Error('PolicyConsentEntity not found');
//     return policyConsent;
//   }
// }

@Injectable()
export class PolicyConsentRepository {
  constructor(
    @InjectRepository(PolicyConsentEntity)
    private readonly policyConsentRepository: Repository<PolicyConsentEntity>,
  ) {}

  async createPolicyConsents(dto: PolicyConsentEntity[]): Promise<PolicyConsentEntity[]> {
    const policyConsent = this.policyConsentRepository.create(dto);
    return this.policyConsentRepository.save(policyConsent);
  }
}
