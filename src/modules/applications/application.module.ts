import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from '../../infrastructure/database/entities/application/application.entity';
import { ParticipationDivisionEntity } from '../../infrastructure/database/entities/application/participation-divsion.entity';
import { PlayerSnapshotEntity } from '../../infrastructure/database/entities/application/player-snapshot.entity';
import { ParticipationDivisionSnapshotEntity } from '../../infrastructure/database/entities/application/participation-division-snapshot.entity';
import { UserApplicationsController } from './presentation/user-applications.controller';
import { ApplicationsAppService } from './application/applications.app.service';
import { ApplicationRepository } from './application.repository';
import { CompetitionEntity } from '../../infrastructure/database/entities/competition/competition.entity';
import { UserEntity } from '../../infrastructure/database/entities/user/user.entity';
import { ApplicationFactory } from './domain/application.factory';
import { PaymentSnapshotEntity } from '../../infrastructure/database/entities/competition/payment-snapshot.entity';
import { ApplicationDomainService } from './domain/application.domain.service';
import { ApplicationValidator } from './domain/application.validator';
import { ParticipationDivisionPaymentEntity } from 'src/infrastructure/database/entities/application/participation-division-payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ApplicationEntity,
      PlayerSnapshotEntity,
      ParticipationDivisionEntity,
      ParticipationDivisionSnapshotEntity,
      CompetitionEntity,
      PaymentSnapshotEntity,
      ParticipationDivisionPaymentEntity,
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
