import { Controller } from '@nestjs/common';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyService } from './policy.service';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/common/guard/role.guard';
import { PolicyEntity } from './entities/policy.entity';

@Controller('user/policy')
export class UserPolicyController {
  constructor(private readonly policyService: PolicyService) {}

  /**
   * u-4-1 find all types of recent policies.
   * - RoleLevel: USER
   * - 가장 최근에 등록된 모든 타입의 약관을 가져옵니다.
   *
   * @tag u-4 policy
   * @returns recent policies
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/recent')
  async findAllRecentPolicies(): Promise<ResponseForm<PolicyEntity[]>> {
    const policies = await this.policyService.findAllTypesOfRecentPolicies();
    return createResponseForm(policies);
  }

  /**
   * u-4-2 find policy by id.
   * - RoleLevel: USER
   *
   * @tag u-4 policy
   * @param id policy id
   * @returns one policy
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/:id')
  async findPolicy(@TypedParam('id') id: number): Promise<ResponseForm<PolicyEntity | null>> {
    const policy = await this.policyService.findPolicy(id);
    return createResponseForm(policy);
  }
}
