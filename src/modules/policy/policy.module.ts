import { Module } from '@nestjs/common';
import { PolicyAppService } from './application/policy.app.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';

@Module({
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyAppService],
})
export class PolicyModule {}
