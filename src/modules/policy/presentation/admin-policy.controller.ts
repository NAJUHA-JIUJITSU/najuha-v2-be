import { Controller } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { CreatePolicyReqDto } from '../dto/request/create-policy.req.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { FindPoliciesReqDto } from '../dto/request/find-policies.req.dto';
import { PolicyResDto } from '../dto/response/policy.res.dto';
import { FindPoliciesResDto } from '../dto/response/find-policies.res.dto';

@Controller('admin/policy')
export class AdminPolicyController {
  constructor(private readonly PolicyAppService: PolicyAppService) {}

  /**
   * a-4-1 create policy
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @returns created policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async postPolicy(@TypedBody() CreatePolicyReqDto: CreatePolicyReqDto): Promise<ResponseForm<PolicyResDto>> {
    const policy = await this.PolicyAppService.createPolicy(CreatePolicyReqDto);
    return createResponseForm(policy);
  }

  /**
   * a-4-1 find policies.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @param type policy type
   * @returns policies
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async findPolicies(@TypedQuery() query: FindPoliciesReqDto): Promise<ResponseForm<FindPoliciesResDto>> {
    const policies = await this.PolicyAppService.findPolicies(query.type);
    return createResponseForm(policies);
  }
}