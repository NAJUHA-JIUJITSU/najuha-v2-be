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

@Controller('admin/policy')
export class AdminPolicyController {
  constructor(
    private readonly policyService: PolicyService,
    private readonly policyConsentService: PolicyConsentService,
  ) {}

  /**
   * a-4-1 create policy.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @returns created policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async createPolicy(@TypedBody() createPolicyDto: CreatePolicyDto): Promise<ResponseForm<PolicyEntity>> {
    const policy = await this.policyService.createPolicy(createPolicyDto);
    return createResponseForm(policy);
  }

  /**
   * a-4-2 get all policies.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @returns all policies
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async findAllPolicies(): Promise<ResponseForm<PolicyEntity[]>> {
    const policies = await this.policyService.findAllPolicies();
    return createResponseForm(policies);
  }

  /**
   * a-4-3 get one policy.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @param id policy id
   * @returns one policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/:id')
  async findOnePolicy(@TypedParam('id') id: number): Promise<ResponseForm<PolicyEntity | null>> {
    const policy = await this.policyService.findOnePolicy(id);
    return createResponseForm(policy);
  }

  /**
   * a-4-4 update policy.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @param id policy id
   * @returns updated policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Patch('/:id')
  async updatePolicy(
    @TypedParam('id') id: PolicyEntity['id'],
    @TypedBody() updatePolicyDto: UpdatePolicyDto,
  ): Promise<ResponseForm<PolicyEntity>> {
    const policy = await this.policyService.updatePolicy(id, updatePolicyDto);
    return createResponseForm(policy);
  }

  /**
   * a-4-5 delete policy.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @returns null
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Delete('/:id')
  async deletePolicy(@TypedParam('id') id: PolicyEntity['id']): Promise<ResponseForm<null>> {
    await this.policyService.deletePolicy(id);
    return createResponseForm(null);
  }
}
