import { Controller } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { CreatePolicyReqDto } from '../structure/dto/request/create-policy.req.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { FindPoliciesReqDto } from '../structure/dto/request/find-policies.req.dto';
import { PolicyResDto } from '../structure/dto/response/policy.res.dto';
import { FindPoliciesResDto } from '../structure/dto/response/find-policies.res.dto';

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
  async postPolicy(@TypedBody() dto: CreatePolicyReqDto): Promise<ResponseForm<PolicyResDto>> {
    const ret = await this.PolicyAppService.createPolicy(dto);
    return createResponseForm(ret);
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
  async findPolicies(@TypedQuery() query: FindPoliciesReqDto): Promise<ResponseForm<FindPoliciesResDto>> {
    const ret = await this.PolicyAppService.findPolicies(query.type);
    return createResponseForm(ret);
  }
}
