import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionEntity } from 'src/competitions/entities/competition.entity';
import { UserCompetitionsController } from 'src/competitions/user-competitions.controller';
import { CompetitionsService } from 'src/competitions/competitions.service';
import { CompetitionsRepository } from './competitions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompetitionEntity])],
  controllers: [UserCompetitionsController],
  providers: [CompetitionsService, CompetitionsRepository],
  exports: [CompetitionsRepository],
})
export class CompetitionsModule {}
