import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { CompetitionsRepository } from '../../infrastructure/database/repositories/competitions.repository';
import { EarlyBirdDiscountStrategyEntity } from 'src/infrastructure/database/entities/early-bird-discount-strategy.entity';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { DivisionEntity } from 'src/infrastructure/database/entities/division.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompetitionEntity, EarlyBirdDiscountStrategyEntity, DivisionEntity])],
  controllers: [UserCompetitionsController, AdminCompetitionsController],
  providers: [CompetitionsAppService, CompetitionsRepository],
  exports: [CompetitionsRepository],
})
export class CompetitionsModule {}
