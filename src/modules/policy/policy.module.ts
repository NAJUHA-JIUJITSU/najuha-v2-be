import { Module } from '@nestjs/common';
import { PolicyAppService } from './application/policy.app.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyEntity } from '../../infrastructure/database/entity/policy/policy.entity';
import { PolicyConsentEntity } from '../../infrastructure/database/entity/user/policy-consent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyEntity, PolicyConsentEntity])],
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyAppService],
})
export class PolicyModule {}
