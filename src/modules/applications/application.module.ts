import { Module } from '@nestjs/common';
import { UserApplicationsController } from './presentation/user-applications.controller';
import { ApplicationsAppService } from './application/applications.app.service';
import { DatabaseModule } from '../../database/database.module';
import { ApplicationValidationDomainService } from './domain/application-validation.domain.service';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [DatabaseModule, PaymentsModule],
  controllers: [UserApplicationsController],
  providers: [ApplicationsAppService, ApplicationValidationDomainService],
})
export class ApplicationModule {}
