import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from '../../infrastructure/database/entity/application/application.entity';
import { ParticipationDivisionInfoEntity } from '../../infrastructure/database/entity/application/participation-division-info.entity';
import { PlayerSnapshotEntity } from '../../infrastructure/database/entity/application/player-snapshot.entity';
import { ParticipationDivisionInfoSnapshotEntity } from '../../infrastructure/database/entity/application/participation-division-info-snapshot.entity';
import { UserApplicationsController } from './presentation/user-applications.controller';
import { ApplicationsAppService } from './application/applications.app.service';
import { ApplicationRepository } from './application.repository';
import { CompetitionEntity } from '../../infrastructure/database/entity/competition/competition.entity';
import { UserEntity } from '../../infrastructure/database/entity/user/user.entity';
import { ApplicationFactory } from './domain/application.factory';
import { PaymentSnapshotEntity } from '../../infrastructure/database/entity/competition/payment-snapshot.entity';
import { ApplicationDomainService } from './domain/application.domain.service';
import { ApplicationValidator } from './domain/application.validator';
import { ParticipationDivisionInfoPaymentEntity } from 'src/infrastructure/database/entity/application/participation-division-info-payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ApplicationEntity,
      PlayerSnapshotEntity,
      ParticipationDivisionInfoEntity,
      ParticipationDivisionInfoSnapshotEntity,
      CompetitionEntity,
      PaymentSnapshotEntity,
      ParticipationDivisionInfoPaymentEntity,
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
