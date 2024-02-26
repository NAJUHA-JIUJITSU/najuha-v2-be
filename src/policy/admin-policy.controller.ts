import { Controller } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/common/guard/role.guard';
import { PolicyEntity } from './entities/policy.entity';

@Controller('admin/policy')
export class AdminPolicyController {
  constructor(private readonly policyService: PolicyService) {}

  /**
   * a-4-1 create policy
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
   * a-4-2 find all policies.
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
   * a-4-3 find policy.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @param id policy id
   * @returns one policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/:id')
  async findPolicy(@TypedParam('id') id: number): Promise<ResponseForm<PolicyEntity | null>> {
    const policy = await this.policyService.findPolicy(id);
    return createResponseForm(policy);
  }

  /**
   * a-4-4 patch policy.
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
    const policy = await this.policyService.savePolicy(id, updatePolicyDto);
    return createResponseForm(policy);
  }
}
