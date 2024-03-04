import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { PolicyEntity } from './entities/policy.entity';
import { PolicyConsentEntity } from './entities/policy-consent.entity';
import { PolicyService } from './policy.service';
import { UserPolicyController } from './user-policy.controller';
import { AdminPolicyController } from './admin-policy.controller';
import { PolicyRepository } from './policy.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyEntity, PolicyConsentEntity, UserEntity])],
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyService, PolicyRepository],
  exports: [PolicyRepository],
})
export class PolicyModule {}
