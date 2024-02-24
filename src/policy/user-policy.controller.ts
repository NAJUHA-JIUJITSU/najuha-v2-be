import { Controller } from '@nestjs/common';
import { TypedParam, TypedRoute } from '@nestia/core';
import { PolicyService } from './policy.service';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/common/guard/role.guard';
import { PolicyEntity } from './entities/policy.entity';

@Controller('user/policy')
export class UserPolicyController {
  constructor(private readonly policyService: PolicyService) {}

  /**
   * u-4-1 getAllTypesOfPolicies
   * - RoleLevel: USER.
   * - 가장 최근에 등록된 모든 타입의 약관을 가져옵니다.
   *
   * @tag u-4 policy
   * @returns recent policies
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/')
  async getAllTypesOfPolicies(): Promise<ResponseForm<PolicyEntity[]>> {
    const policies = await this.policyService.getAllTypesOfPolicies();
    return createResponseForm(policies);
  }

  /**
   * u-4-2 getPolicy
   * - RoleLevel: USER.
   * - 약관 ID로 약관을 가져옵니다.
   *
   * @tag u-4 policy
   * @param id policy id
   * @returns policy
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/:id')
  async getPolicy(@TypedParam('id') id: number): Promise<ResponseForm<PolicyEntity | null>> {
    const policy = await this.policyService.getPolicy(id);
    return createResponseForm(policy);
  }
}
