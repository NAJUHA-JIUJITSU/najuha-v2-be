import { Controller } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { PolicyService } from './policy.service';
import { PolicyConsentService } from './policy-consent.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/common/guard/role.guard';
import { PolicyEntity } from './entities/policy.entity';

@Controller('admin/policy')
export class AdminPolicyController {
  constructor(
    private readonly policyService: PolicyService,
    private readonly policyConsentService: PolicyConsentService,
  ) {}

  /**
   * a-4-1 postPolicy
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @returns created policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async postPolicy(@TypedBody() createPolicyDto: CreatePolicyDto): Promise<ResponseForm<PolicyEntity>> {
    const policy = await this.policyService.createPolicy(createPolicyDto);
    return createResponseForm(policy);
  }

  /**
   * a-4-2 getAllPolicies.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @returns all policies
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async getAllPolicies(): Promise<ResponseForm<PolicyEntity[]>> {
    const policies = await this.policyService.getAllPolicies();
    return createResponseForm(policies);
  }

  /**
   * a-4-3 getPolicy.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @param id policy id
   * @returns one policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/:id')
  async getPolicy(@TypedParam('id') id: number): Promise<ResponseForm<PolicyEntity | null>> {
    const policy = await this.policyService.getPolicy(id);
    return createResponseForm(policy);
  }

  /**
   * a-4-4 patchPolicy.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @param id policy id
   * @returns updated policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Patch('/:id')
  async patchPolicy(
    @TypedParam('id') id: PolicyEntity['id'],
    @TypedBody() updatePolicyDto: UpdatePolicyDto,
  ): Promise<ResponseForm<PolicyEntity>> {
    const policy = await this.policyService.updatePolicy(id, updatePolicyDto);
    return createResponseForm(policy);
  }

  /**
   * a-4-5 deletePolicy.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @param id policy id
   * @returns null
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Delete('/:id')
  async deletePolicy(@TypedParam('id') id: PolicyEntity['id']): Promise<ResponseForm<null>> {
    await this.policyService.deletePolicy(id);
    return createResponseForm(null);
  }
}
