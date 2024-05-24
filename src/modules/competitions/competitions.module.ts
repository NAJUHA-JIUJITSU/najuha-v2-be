import { Module } from '@nestjs/common';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { DivisionFactory } from './domain/division.factory';
import { CompetitionFactory } from './domain/competition.factory';
import { DatabaseModule } from 'src//database/database.module';
import { HostCompetitionsController } from './presentation/host-competitions.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UserCompetitionsController, AdminCompetitionsController, HostCompetitionsController],
  providers: [CompetitionsAppService, DivisionFactory, CompetitionFactory],
})
export class CompetitionsModule {}
