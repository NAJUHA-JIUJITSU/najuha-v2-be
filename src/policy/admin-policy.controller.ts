import { Controller } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/common/guard/role.guard';
import { PolicyEntity } from './entities/policy.entity';
import { PolicyTypeQuery } from './types/PolicyTypeQuery.type';

@Controller('admin/policy')
export class AdminPolicyController {
  constructor(private readonly policyService: PolicyService) {}

  /**
   * a-4-1 create policy
   * - RoleLevel: ADMIN
   *
   * @tag a-4 policy
   * @returns created policy
   */
  @RoleLevels(RoleLevel.ADMIN)
  @TypedRoute.Post('/')
  async postPolicy(@TypedBody() createPolicyDto: CreatePolicyDto): Promise<ResponseForm<PolicyEntity>> {
    const policy = await this.policyService.createPolicy(createPolicyDto);
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
  async findAllPolicies(@TypedQuery() query: PolicyTypeQuery): Promise<ResponseForm<PolicyEntity[]>> {
    const policies = await this.policyService.findAllPolicies(query.type);
    return createResponseForm(policies);
  }
}
