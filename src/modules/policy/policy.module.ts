import { Module } from '@nestjs/common';
import { PolicyAppService } from './application/policy.app.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';
import { PolicyRepository } from '../../infrastructure/database/repository/policy.repository';
import { UserRepository } from 'src/infrastructure/database/repository/user.repository';
import { PolicyConsentRepository } from 'src/infrastructure/database/repository/policy-consent.repository';

@Module({
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyAppService, PolicyRepository, PolicyConsentRepository, UserRepository],
  exports: [PolicyRepository],
})
export class PolicyModule {}
