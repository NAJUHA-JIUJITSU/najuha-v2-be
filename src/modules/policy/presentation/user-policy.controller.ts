import { Controller } from '@nestjs/common';
import { TypedParam, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { IPolicy } from '../domain/interface/policy.interface';
import { FindAllRecentPoliciesRes, FindPolicyRes } from './dtos';

@Controller('user/policy')
export class UserPolicyController {
  constructor(private readonly PolicyAppService: PolicyAppService) {}

  /**
   * u-4-1 findAllRecentPolicies.
   * - RoleLevel: TEMPORARY_USER.
   * - 가장 최근에 등록된 모든 타입의 약관을 가져옵니다.
   *
   * @tag u-4 policy
   * @returns recent policies
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/recent')
  async findAllRecentPolicies(): Promise<ResponseForm<FindAllRecentPoliciesRes>> {
    return createResponseForm(await this.PolicyAppService.findAllTypesOfLatestPolicies());
  }

  /**
   * u-4-2 findPolicy.
   * - RoleLevel: TEMPORARY_USER.
   *
   * @tag u-4 policy
   * @param id policy id
   * @returns policy
   */
  @RoleLevels(RoleLevel.PUBLIC)
  @TypedRoute.Get('/:policyId')
  async findPolicy(@TypedParam('policyId') id: IPolicy['id']): Promise<ResponseForm<FindPolicyRes>> {
    return createResponseForm(await this.PolicyAppService.findPolicy({ id }));
  }
}
