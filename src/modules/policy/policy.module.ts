import { Module } from '@nestjs/common';
import { PolicyAppService } from './application/policy.app.service';
import { UserPolicyController } from './presentation/user-policy.controller';
import { AdminPolicyController } from './presentation/admin-policy.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserPolicyController, AdminPolicyController],
  providers: [PolicyAppService],
})
export class PolicyModule {}
