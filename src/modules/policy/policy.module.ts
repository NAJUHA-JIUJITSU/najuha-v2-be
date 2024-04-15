import { Module } from '@nestjs/common';
import { PolicyAppService } from './application/policy.app.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyTable } from '../../infrastructure/database/tables/policy/policy.entity';
import { PolicyConsentTable } from '../../infrastructure/database/tables/user/policy-consent.entity';
import { PolicyRepository } from './policy.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyTable, PolicyConsentTable])],
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyAppService, PolicyRepository],
})
export class PolicyModule {}
