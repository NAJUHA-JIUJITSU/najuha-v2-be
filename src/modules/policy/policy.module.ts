import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/users/domain/user.entity';
import { PolicyEntity } from './domain/policy.entity';
import { PolicyConsentEntity } from './domain/policy-consent.entity';
import { PolicyAppService } from './application/policy.app.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';
import { PolicyRepository } from './repository/policy.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyEntity, PolicyConsentEntity, UserEntity])],
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyAppService, PolicyRepository],
  exports: [PolicyRepository],
})
export class PolicyModule {}
