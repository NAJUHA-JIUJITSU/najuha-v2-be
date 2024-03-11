import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { PolicyEntity } from '../../infrastructure/database/entities/policy.entity';
import { PolicyConsentEntity } from '../../infrastructure/database/entities/policy-consent.entity';
import { PolicyAppService } from './application/policy.app.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';
import { PolicyRepository } from '../../infrastructure/database/repositories/policy.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyEntity, PolicyConsentEntity, UserEntity])],
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyAppService, PolicyRepository],
  exports: [PolicyRepository],
})
export class PolicyModule {}
