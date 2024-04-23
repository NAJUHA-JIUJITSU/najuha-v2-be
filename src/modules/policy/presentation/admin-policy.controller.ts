import { Controller } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { CreatePolicyReqBody, CreatePolicyRes, FindPoliciesReqQuery, FindPoliciesRes } from './dtos';

@Controller('admin/policy')
export class AdminPolicyController {
  constructor(private readonly PolicyAppService: PolicyAppService) {}

  /**
   * a-4-1 create policy.
   * - RoleLevel: ADMIN.
   *
   * @tag a-4 policy
   * @returns created policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async postPolicy(@TypedBody() body: CreatePolicyReqBody): Promise<ResponseForm<CreatePolicyRes>> {
    return createResponseForm(await this.PolicyAppService.createPolicy({ policyCreateDto: body }));
  }

  /**
   * a-4-1 find policies.
   * - RoleLevel: ADMIN.
   *
   * @tag a-4 policy
   * @param type policy type
   * @returns policies
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async findPolicies(@TypedQuery() query: FindPoliciesReqQuery): Promise<ResponseForm<FindPoliciesRes>> {
    return createResponseForm(await this.PolicyAppService.findPolicies({ type: query.type }));
  }
}
