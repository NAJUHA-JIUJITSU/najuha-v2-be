import { Controller } from '@nestjs/common';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { PolicyService } from './policy.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { RoleLevels, RoleLevel } from 'src/common/guard/role.guard';
import { PolicyEntity } from './entities/policy.entity';

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
}
