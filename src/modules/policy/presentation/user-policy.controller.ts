import { Controller } from '@nestjs/common';
import { TypedParam, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { IPolicy } from '../domain/interface/policy.interface';
import { FindAllTypesOfLatestPoliciesRes, GetPolicyRes } from './policy.controller.dto';

@Controller('user/policies')
export class UserPolicyController {
  constructor(private readonly PolicyAppService: PolicyAppService) {}

  /**
   * u-4-1 findAllTypesOfLatestPolicies.
   * - RoleLevel: TEMPORARY_USER.
   * - 가장 최근에 등록된 모든 타입의 약관을 가져옵니다.
   *
   * @tag u-4 policy
   * @security bearer
   * @returns FindAllTypesOfLatestPoliciesRes
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('/latest')
  async findAllTypesOfLatestPolicies(): Promise<ResponseForm<FindAllTypesOfLatestPoliciesRes>> {
    return createResponseForm(await this.PolicyAppService.findAllTypesOfLatestPolicies());
  }

  /**
   * u-4-2 getPolicy.
   * - RoleLevel: TEMPORARY_USER.
   * - policyId에 해당하는 약관을 조회합니다.
   *
   * @tag u-4 policy
   * @security bearer
   * @param policyId policyId
   * @returns GetPolicyRes
   */
  @RoleLevels(RoleLevel.TEMPORARY_USER)
  @TypedRoute.Get('/:policyId')
  async getPolicy(@TypedParam('policyId') policyId: IPolicy['id']): Promise<ResponseForm<GetPolicyRes>> {
    return createResponseForm(await this.PolicyAppService.getPolicy({ id: policyId }));
  }
}
