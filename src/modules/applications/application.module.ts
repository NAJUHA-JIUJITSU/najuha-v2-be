import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './domain/entities/application.entity';
import { ParticipationDivision } from './domain/entities/participation-divsion.entity';
import { PlayerSnapshot } from './domain/entities/player-snapshot.entity';
import { ParticipationDivisionSnapshot } from './domain/entities/participation-division-snapshot.entity';
import { UserApplicationsController } from './presentation/user-applications.controller';
import { ApplicationsAppService } from './application/applications.app.service';
import { ApplicationRepository } from './application.repository';
import { Competition } from '../competitions/domain/entities/competition.entity';
import { User } from '../users/domain/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Application,
      PlayerSnapshot,
      ParticipationDivision,
      ParticipationDivisionSnapshot,
      Competition,
    ]),
  ],
  controllers: [UserApplicationsController],
  providers: [ApplicationsAppService, ApplicationRepository],
})
export class ApplicationModule {}
