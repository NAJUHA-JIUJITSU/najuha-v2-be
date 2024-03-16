import { Controller } from '@nestjs/common';
import { TypedParam, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { FindPoliciesResDto } from '../dto/response/find-policies.res.dto';
import { FindPolicyResDto } from '../dto/response/find-policy.res.dto';
import { PolicyEntity } from 'src/modules/policy/domain/policy.entity';

@Controller('user/policy')
export class UserPolicyController {
  constructor(private readonly PolicyAppService: PolicyAppService) {}

  /**
   * u-4-1 find all types of recent policies.
   * - RoleLevel: TEMPORARY_USER.
   * - 가장 최근에 등록된 모든 타입의 약관을 가져옵니다.
   *
   * @tag u-4 policy
   * @returns recent policies
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('/recent')
  async findAllRecentPolicies(): Promise<ResponseForm<FindPoliciesResDto>> {
    const ret = await this.PolicyAppService.findAllTypesOfLatestPolicies();
    return createResponseForm(ret);
  }

  /**
   * u-4-2 find policy by id.
   * - RoleLevel: TEMPORARY_USER.
   *
   * @tag u-4 policy
   * @param id policy id
   * @returns policy
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('/:id')
  async findPolicy(@TypedParam('id') id: PolicyEntity['id']): Promise<ResponseForm<FindPolicyResDto>> {
    const ret = await this.PolicyAppService.findPolicy(id);
    return createResponseForm(ret);
  }
}
