import { Controller } from '@nestjs/common';
import { TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { PolicyEntity } from '../../../infrastructure/database/entities/policy.entity';
import { IPolicy } from 'src/interfaces/policy.interface';

@Controller('user/policy')
export class UserPolicyController {
  constructor(private readonly PolicyAppService: PolicyAppService) {}

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
  async findAllRecentPolicies(): Promise<ResponseForm<IPolicy[]>> {
    const policies = await this.PolicyAppService.findAllTypesOfLatestPolicies();
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
    const policy = await this.PolicyAppService.findOnePolicy(id);
    return createResponseForm(policy);
  }
}
