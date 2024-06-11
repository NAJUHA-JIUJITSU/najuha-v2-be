import { Module } from '@nestjs/common';
import { UserCompetitionsController } from './presentation/user-competitions.controller';
import { CompetitionsAppService } from './application/competitions.app.service';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { DivisionFactory } from './domain/division.factory';
import { CompetitionFactory } from './domain/competition.factory';
import { DatabaseModule } from '../../database/database.module';
import { HostCompetitionsController } from './presentation/host-competitions.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserCompetitionsController, AdminCompetitionsController, HostCompetitionsController],
  providers: [CompetitionsAppService, DivisionFactory, CompetitionFactory],
})
export class CompetitionsModule {}
