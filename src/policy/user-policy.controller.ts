import { Controller } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { PolicyService } from './policy.service';
import { PolicyConsentService } from './policy-consent.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { CreatePolicyConsentDto } from './dto/create-policy-consent.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/common/guard/role.guard';
import { PolicyEntity } from './entities/policy.entity';
import { PolicyConsentEntity } from './entities/policy-consent.entity';

// TODO: api 권한 설정
@Controller('user/policy')
export class UserPolicyController {
  constructor(
    private readonly policyService: PolicyService,
    private readonly policyConsentService: PolicyConsentService,
  ) {}

  /**
   * u-4-1 create policy.
   * - RoleLevel: TEMPORARY_USER
   *
   * @tag u-4 policy
   * @returns created policy
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Post('/')
  async createPolicy(@TypedBody() createPolicyDto: CreatePolicyDto): Promise<ResponseForm<PolicyEntity>> {
    const policy = await this.policyService.createPolicy(createPolicyDto);
    return createResponseForm(policy);
  }

  /**
   * u-4-2 get all policies.
   * - RoleLevel: TEMPORARY_USER
   *
   * @tag u-4 policy
   * @returns all policies
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('/')
  async findAllPolicies(): Promise<ResponseForm<PolicyEntity[]>> {
    const policies = await this.policyService.findAllPolicies();
    return createResponseForm(policies);
  }

  /**
   * u-4-3 get one policy.
   * - RoleLevel: TEMPORARY_USER
   *
   * @tag u-4 policy
   * @param id policy id
   * @returns one policy
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('/:id')
  async findOnePolicy(@TypedParam('id') id: number): Promise<ResponseForm<PolicyEntity | null>> {
    const policy = await this.policyService.findOnePolicy(id);
    return createResponseForm(policy);
  }

  /**
   * u-4-4 update policy.
   * - RoleLevel: TEMPORARY_USER
   *
   * @tag u-4 policy
   * @param id policy id
   * @returns updated policy
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Patch('/:id')
  async updatePolicy(
    @TypedParam('id') id: PolicyEntity['id'],
    @TypedBody() updatePolicyDto: UpdatePolicyDto,
  ): Promise<ResponseForm<PolicyEntity>> {
    const policy = await this.policyService.updatePolicy(id, updatePolicyDto);
    return createResponseForm(policy);
  }

  /**
   * u-4-5 delete policy.
   * - RoleLevel: TEMPORARY_USER
   *
   * @tag u-4 policy
   * @returns null
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Delete('/:id')
  async deletePolicy(@TypedParam('id') id: PolicyEntity['id']): Promise<ResponseForm<null>> {
    await this.policyService.deletePolicy(id);
    return createResponseForm(null);
  }

  /**
   * u-4-6 create policy consent.
   * - RoleLevel: TEMPORARY_USER
   *
   * @tag u-4 policy
   * @returns created policy consent
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Post('/consent')
  async createPolicyConsent(
    @TypedBody() createPolicyConsentDto: CreatePolicyConsentDto,
  ): Promise<ResponseForm<PolicyConsentEntity>> {
    const consent = await this.policyConsentService.createPolicyConsent(createPolicyConsentDto);
    return createResponseForm(consent);
  }

  /**
   *  u-4-7 get all policy consents.
   * - RoleLevel: TEMPORARY_USER
   *
   * @tag u-4 policy
   * @returns all policy consents
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('/consent')
  async findAllPolicyConsents(): Promise<ResponseForm<PolicyConsentEntity[]>> {
    const consents = await this.policyConsentService.findAllPolicyConsents();
    return createResponseForm(consents);
  }

  /**
   * u-4-8 get one policy consent.
   * - RoleLevel: TEMPORARY_USER
   *
   * @tag u-4 policy
   * @returns one policy consent
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('/consent/:id')
  async findOnePolicyConsent(
    @TypedParam('id') id: PolicyConsentEntity['id'],
  ): Promise<ResponseForm<PolicyConsentEntity | null>> {
    const consent = await this.policyConsentService.findOnePolicyConsent(id);
    return createResponseForm(consent);
  }
}
