import { Module } from '@nestjs/common';
import { PolicyAppService } from './application/policy.app.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './domain/entities/policy.entity';
import { PolicyConsent } from '../users/domain/entities/policy-consent.entity';
import { PolicyRepository } from './policy.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Policy, PolicyConsent])],
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyAppService, PolicyRepository],
})
export class PolicyModule {}
