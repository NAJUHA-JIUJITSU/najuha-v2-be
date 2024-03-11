import { Injectable } from '@nestjs/common';
// import { BusinessException } from 'src/common/response/errorResponse';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { PolicyConsentEntity } from '../entities/policy-consent.entity';
import { IPolicyConsent } from 'src/interfaces/policy-consent.interface';

@Injectable()
export class PolicyConsentRepository extends Repository<PolicyConsentEntity> {
  constructor(private dataSource: DataSource) {
    super(PolicyConsentEntity, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<IPolicyConsent, 'id'> & Partial<IPolicyConsent>): Promise<IPolicyConsent> {
    const policyConsent = await this.findOne({ where: { id: dto.id } });
    // if (!policyConsent) throw new BusinessException(PolicyConsentErrorMap.policyConsentS_policyConsent_NOT_FOUND);
    if (!policyConsent) throw new Error('PolicyConsent not found');
    return await this.save({ ...policyConsent, ...dto });
  }

  async updateOrFail(dto: Pick<IPolicyConsent, 'id'> & Partial<IPolicyConsent>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    // if (!result.affected) throw new BusinessException(PolicyConsentErrorMap.policyConsentS_policyConsent_NOT_FOUND);
    if (!result.affected) throw new Error('PolicyConsent not found');
  }

  async getOneOrFail(where: FindOptionsWhere<IPolicyConsent>): Promise<IPolicyConsent> {
    const policyConsent = await this.findOne({ where });
    // if (!policyConsent) throw new BusinessException(PolicyConsentErrorMap.policyConsentS_policyConsent_NOT_FOUND);
    if (!policyConsent) throw new Error('PolicyConsent not found');
    return policyConsent;
  }
}
