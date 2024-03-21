import { Module } from '@nestjs/common';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { DivisionPackDomainService } from './domain/division-pack.domain.service';

@Module({
  controllers: [UserCompetitionsController, AdminCompetitionsController],
  providers: [CompetitionsAppService, DivisionPackDomainService],
})
export class CompetitionsModule {}
