import { Controller } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { PolicyService } from './policy.service';
import { PolicyConsentService } from './policy-consent.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { CreatePolicyConsentDto } from './dto/create-policy-consent.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { SetGuardLevel, GuardLevel } from 'src/auth/auth.guard';
import { PolicyEntity } from './entities/policy.entity';
import { PolicyConsentEntity } from './entities/policy-consent.entity';

// TODO: api 권한 설정
@Controller('policy')
export class PolicyController {
  constructor(
    private readonly policyService: PolicyService,
    private readonly policyConsentService: PolicyConsentService,
  ) {}

  /**
   * 4-1 create policy.
   * - GuardLevel: TEMPORARY_USER
   *
   * @tag 4 policy
   * @returns created policy
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Post('/')
  async createPolicy(@TypedBody() createPolicyDto: CreatePolicyDto): Promise<ResponseForm<PolicyEntity>> {
    const policy = await this.policyService.createPolicy(createPolicyDto);
    return createResponseForm(policy);
  }

  /**
   * 4-2 get all policies.
   * - GuardLevel: TEMPORARY_USER
   *
   * @tag 4 policy
   * @returns all policies
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Get('/')
  async findAllPolicies(): Promise<ResponseForm<PolicyEntity[]>> {
    const policies = await this.policyService.findAllPolicies();
    return createResponseForm(policies);
  }

  /**
   * 4-3 get one policy.
   * - GuardLevel: TEMPORARY_USER
   *
   * @tag 4 policy
   * @param id policy id
   * @returns one policy
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Get('/:id')
  async findOnePolicy(@TypedParam('id') id: number): Promise<ResponseForm<PolicyEntity | null>> {
    const policy = await this.policyService.findOnePolicy(id);
    return createResponseForm(policy);
  }

  /**
   * 4-4 update policy.
   * - GuardLevel: TEMPORARY_USER
   *
   * @tag 4 policy
   * @param id policy id
   * @returns updated policy
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Patch('/:id')
  async updatePolicy(
    @TypedParam('id') id: PolicyEntity['id'],
    @TypedBody() updatePolicyDto: UpdatePolicyDto,
  ): Promise<ResponseForm<PolicyEntity>> {
    const policy = await this.policyService.updatePolicy(id, updatePolicyDto);
    return createResponseForm(policy);
  }

  /**
   * 4-5 delete policy.
   * - GuardLevel: TEMPORARY_USER
   *
   * @tag 4 policy
   * @returns null
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Delete('/:id')
  async deletePolicy(@TypedParam('id') id: PolicyEntity['id']): Promise<ResponseForm<null>> {
    await this.policyService.deletePolicy(id);
    return createResponseForm(null);
  }

  /**
   * 4-6 create policy consent.
   * - GuardLevel: TEMPORARY_USER
   *
   * @tag 4 policy
   * @returns created policy consent
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Post('/consent')
  async createPolicyConsent(
    @TypedBody() createPolicyConsentDto: CreatePolicyConsentDto,
  ): Promise<ResponseForm<PolicyConsentEntity>> {
    const consent = await this.policyConsentService.createPolicyConsent(createPolicyConsentDto);
    return createResponseForm(consent);
  }

  /**
   *  4-7 get all policy consents.
   * - GuardLevel: TEMPORARY_USER
   *
   * @tag 4 policy
   * @returns all policy consents
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Get('/consent')
  async findAllPolicyConsents(): Promise<ResponseForm<PolicyConsentEntity[]>> {
    const consents = await this.policyConsentService.findAllPolicyConsents();
    return createResponseForm(consents);
  }

  /**
   * 4-8 get one policy consent.
   * - GuardLevel: TEMPORARY_USER
   *
   * @tag 4 policy
   * @returns one policy consent
   */
  @SetGuardLevel(GuardLevel.TEMPORARY_USER)
  @TypedRoute.Get('/consent/:id')
  async findOnePolicyConsent(
    @TypedParam('id') id: PolicyConsentEntity['id'],
  ): Promise<ResponseForm<PolicyConsentEntity | null>> {
    const consent = await this.policyConsentService.findOnePolicyConsent(id);
    return createResponseForm(consent);
  }
}
