import { Module } from '@nestjs/common';
import { UserApplicationsController } from './presentation/user-applications.controller';
import { ApplicationsAppService } from './application/applications.app.service';
import { ApplicationFactory } from './domain/application.factory';
import { DatabaseModule } from '../../database/database.module';
import { ApplicationValidationService } from './domain/application-validation.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserApplicationsController],
  providers: [ApplicationsAppService, ApplicationFactory, ApplicationValidationService],
})
export class ApplicationModule {}
