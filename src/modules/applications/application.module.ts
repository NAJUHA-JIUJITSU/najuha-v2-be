import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationTable } from '../../infrastructure/database/tables/application/application.table';
import { ParticipationDivisionInfoTable } from '../../infrastructure/database/tables/application/participation-division-info.table';
import { PlayerSnapshotTable } from '../../infrastructure/database/tables/application/player-snapshot.table';
import { ParticipationDivisionInfoSnapshotTable } from '../../infrastructure/database/tables/application/participation-division-info-snapshot.table';
import { UserApplicationsController } from './presentation/user-applications.controller';
import { ApplicationsAppService } from './application/applications.app.service';
import { ApplicationRepository } from './application.repository';
import { CompetitionTable } from '../../infrastructure/database/tables/competition/competition.table';
import { UserTable } from '../../infrastructure/database/tables/user/user.entity';
import { ApplicationFactory } from './domain/application.factory';
import { PaymentSnapshotTable } from '../../infrastructure/database/tables/competition/payment-snapshot.table';
import { ApplicationDomainService } from './domain/application.domain.service';
import { ApplicationValidator } from './domain/application.validator';
import { ParticipationDivisionInfoPaymentTable } from 'src/infrastructure/database/tables/application/participation-division-info-payment.table';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTable,
      ApplicationTable,
      PlayerSnapshotTable,
      ParticipationDivisionInfoTable,
      ParticipationDivisionInfoSnapshotTable,
      CompetitionTable,
      PaymentSnapshotTable,
      ParticipationDivisionInfoPaymentTable,
    ]),
  ],
  controllers: [UserApplicationsController],
  providers: [
    ApplicationsAppService,
    ApplicationRepository,
    ApplicationFactory,
    ApplicationDomainService,
    ApplicationValidator,
  ],
})
export class ApplicationModule {}
