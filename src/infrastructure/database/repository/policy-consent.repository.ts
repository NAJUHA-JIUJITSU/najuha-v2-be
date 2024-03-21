import { Injectable } from '@nestjs/common';
// import { BusinessException } from 'src/common/response/errorResponse';
import { DataSource, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { PolicyConsent } from '../../../modules/policy/domain/policy-consent.entity';

// TODO: 에러 표준화
@Injectable()
export class PolicyConsentRepository extends Repository<PolicyConsent> {
  constructor(private dataSource: DataSource) {
    super(PolicyConsent, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<PolicyConsent, 'id'> & Partial<PolicyConsent>): Promise<PolicyConsent> {
    const policyConsent = await this.findOne({ where: { id: dto.id } });
    if (!policyConsent) throw new Error('PolicyConsent not found');
    return await this.save({ ...policyConsent, ...dto });
  }

  async updateOrFail(dto: Pick<PolicyConsent, 'id'> & Partial<PolicyConsent>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    if (!result.affected) throw new Error('PolicyConsent not found');
  }

  async getOneOrFail({ where, relations }: FindOneOptions<PolicyConsent>): Promise<PolicyConsent> {
    const policyConsent = await this.findOne({ where, relations });
    if (!policyConsent) throw new Error('PolicyConsent not found');
    return policyConsent;
  }
}
