import { Injectable } from '@nestjs/common';
// import { BusinessException } from 'src/common/response/errorResponse';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { PolicyConsentEntity } from '../entities/policy-consent.entity';

@Injectable()
export class PolicyConsentRepository extends Repository<PolicyConsentEntity> {
  constructor(private dataSource: DataSource) {
    super(PolicyConsentEntity, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<PolicyConsentEntity, 'id'> & Partial<PolicyConsentEntity>): Promise<PolicyConsentEntity> {
    const policyConsent = await this.findOne({ where: { id: dto.id } });
    // if (!policyConsent) throw new BusinessException(PolicyConsentErrorMap.policyConsentS_policyConsent_NOT_FOUND);
    if (!policyConsent) throw new Error('PolicyConsent not found');
    return await this.save({ ...policyConsent, ...dto });
  }

  async updateOrFail(dto: Pick<PolicyConsentEntity, 'id'> & Partial<PolicyConsentEntity>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    // if (!result.affected) throw new BusinessException(PolicyConsentErrorMap.policyConsentS_policyConsent_NOT_FOUND);
    if (!result.affected) throw new Error('PolicyConsent not found');
  }

  async getOneOrFail(where: FindOptionsWhere<PolicyConsentEntity>): Promise<PolicyConsentEntity> {
    const policyConsent = await this.findOne({ where });
    // if (!policyConsent) throw new BusinessException(PolicyConsentErrorMap.policyConsentS_policyConsent_NOT_FOUND);
    if (!policyConsent) throw new Error('PolicyConsent not found');
    return policyConsent;
  }
}
