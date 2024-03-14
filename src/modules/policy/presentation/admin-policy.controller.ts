import { Controller } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { CreatePolicyReqDto } from '../dto/request/create-policy.req.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { FindAllPoliciesReqDto } from '../dto/request/find-all-policies.req.dto';
import { GetOnePolicyResDto } from '../dto/response/get-one-policy.res.dto';
import { FindAllPoliciesResDto } from '../dto/response/find-all-policies.res.dto';

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
  async postPolicy(@TypedBody() CreatePolicyReqDto: CreatePolicyReqDto): Promise<ResponseForm<GetOnePolicyResDto>> {
    const policy = await this.PolicyAppService.createPolicy(CreatePolicyReqDto);
    return createResponseForm(policy);
  }

  /**
   * a-4-1 find all policies.
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @param type policy type
   * @returns all policies
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Get('/')
  async findAllPolicies(@TypedQuery() query: FindAllPoliciesReqDto): Promise<ResponseForm<FindAllPoliciesResDto>> {
    const policies = await this.PolicyAppService.findAllPolicies(query.type);
    return createResponseForm(policies);
  }
}
