import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../../infrastructure/database/entities/application/application.entity';
import { ParticipationDivision } from '../../infrastructure/database/entities/application/participation-divsion.entity';
import { PlayerSnapshot } from '../../infrastructure/database/entities/application/player-snapshot.entity';
import { ParticipationDivisionSnapshot } from '../../infrastructure/database/entities/application/participation-division-snapshot.entity';
import { UserApplicationsController } from './presentation/user-applications.controller';
import { ApplicationsAppService } from './application/applications.app.service';
import { ApplicationRepository } from './application.repository';
import { Competition } from '../../infrastructure/database/entities/competition/competition.entity';
import { UserEntity } from '../../infrastructure/database/entities/user/user.entity';
import { ApplicationFactory } from './domain/application.factory';
import { PaymentSnapshot } from '../../infrastructure/database/entities/competition/payment-snapshot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      Application,
      PlayerSnapshot,
      ParticipationDivision,
      ParticipationDivisionSnapshot,
      Competition,
      PaymentSnapshot,
    ]),
  ],
  controllers: [UserApplicationsController],
  providers: [ApplicationsAppService, ApplicationRepository, ApplicationFactory],
})
export class ApplicationModule {}
