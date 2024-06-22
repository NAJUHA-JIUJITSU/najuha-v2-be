import { Controller } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { ResponseForm, createResponseForm } from '../../../common/response/response';
import { RoleLevels, RoleLevel } from '../../../infrastructure/guard/role.guard';
import { CreatePolicyReqBody, CreatePolicyRes, FindPoliciesReqQuery, FindPoliciesRes } from './policy.controller.dto';

@Controller('admin/policies')
export class AdminPolicyController {
  constructor(private readonly PolicyAppService: PolicyAppService) {}

  /**
   * a-4-1 createPolicy.
   * - RoleLevel: ADMIN.
   *
   * @tag a-4 policy
   * @security bearer
   * @param body CreatePolicyReqBody
   * @returns CreatePolicyRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async createPolicy(@TypedBody() body: CreatePolicyReqBody): Promise<ResponseForm<CreatePolicyRes>> {
    return createResponseForm(await this.PolicyAppService.createPolicy({ ...body }));
  }

  /**
   * a-4-1 findPolicies.
   * - RoleLevel: ADMIN.
   *
   * @tag a-4 policy
   * @security bearer
   * @param query FindPoliciesReqQuery
   * @returns FindPoliciesRes
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async findPolicies(@TypedQuery() query: FindPoliciesReqQuery): Promise<ResponseForm<FindPoliciesRes>> {
    return createResponseForm(await this.PolicyAppService.findPolicies({ type: query.type }));
  }
}
