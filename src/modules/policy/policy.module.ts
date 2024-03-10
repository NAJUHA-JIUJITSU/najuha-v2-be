import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/infra/database/entities/user.entity';
import { PolicyEntity } from '../../infra/database/entities/policy.entity';
import { PolicyConsentEntity } from '../../infra/database/entities/policy-consent.entity';
import { PolicyService } from './application/policy.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';
import { PolicyRepository } from '../../infra/database/repositories/policy.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyEntity, PolicyConsentEntity, UserEntity])],
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyService, PolicyRepository],
  exports: [PolicyRepository],
})
export class PolicyModule {}
