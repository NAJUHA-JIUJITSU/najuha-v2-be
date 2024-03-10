import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionEntity } from 'src/infra/database/entities/competition.entity';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsService } from 'src/modules/competitions/application/competitions.service';
import { CompetitionsRepository } from '../../infra/database/repositories/competitions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompetitionEntity])],
  controllers: [UserCompetitionsController],
  providers: [CompetitionsService, CompetitionsRepository],
  exports: [CompetitionsRepository],
})
export class CompetitionsModule {}
