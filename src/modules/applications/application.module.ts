import { Module } from '@nestjs/common';
import { UserApplicationsController } from './presentation/user-applications.controller';
import { ApplicationsAppService } from './application/applications.app.service';
import { ApplicationFactory } from './domain/application.factory';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserApplicationsController],
  providers: [ApplicationsAppService, ApplicationFactory],
})
export class ApplicationModule {}
