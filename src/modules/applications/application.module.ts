import { Module } from '@nestjs/common';
import { UserApplicationsController } from './presentation/user-applications.controller';
import { ApplicationsAppService } from './application/applications.app.service';
import { ApplicationFactory } from './domain/application.factory';
import { ApplicationDomainService } from './domain/application.domain.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserApplicationsController],
  providers: [ApplicationsAppService, ApplicationFactory, ApplicationDomainService],
})
export class ApplicationModule {}
