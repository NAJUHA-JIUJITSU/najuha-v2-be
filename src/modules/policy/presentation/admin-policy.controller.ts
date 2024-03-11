import { Controller } from '@nestjs/common';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyAppService } from '../application/policy.app.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { PolicyTypeQuery } from './dto/PolicyTypeQuery.type';
import { IPolicy } from 'src/interfaces/policy.interface';

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
  async postPolicy(@TypedBody() createPolicyDto: CreatePolicyDto): Promise<ResponseForm<IPolicy>> {
    const policy = await this.PolicyAppService.createPolicy(createPolicyDto);
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
  async findAllPolicies(@TypedQuery() query: PolicyTypeQuery): Promise<ResponseForm<IPolicy[]>> {
    const policies = await this.PolicyAppService.findAllPolicies(query.type);
    return createResponseForm(policies);
  }
}
