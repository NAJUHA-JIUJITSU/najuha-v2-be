import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/domain/user.entity';
import { Policy } from './domain/policy.entity';
import { PolicyConsent } from './domain/policy-consent.entity';
import { PolicyAppService } from './application/policy.app.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';
import { PolicyRepository } from '../../infrastructure/database/repository/policy.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Policy, PolicyConsent, User])],
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyAppService, PolicyRepository],
  exports: [PolicyRepository],
})
export class PolicyModule {}
