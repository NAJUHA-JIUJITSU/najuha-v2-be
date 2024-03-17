import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from 'src/modules/competitions/domain/competition.entity';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { CompetitionsRepository } from './repository/competitions.repository';
import { EarlyBirdDiscountStrategy } from 'src/modules/competitions/domain/early-bird-discount-strategy.entity';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { Division } from 'src/modules/competitions/domain/division.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Competition, EarlyBirdDiscountStrategy, Division])],
  controllers: [UserCompetitionsController, AdminCompetitionsController],
  providers: [CompetitionsAppService, CompetitionsRepository],
  exports: [CompetitionsRepository],
})
export class CompetitionsModule {}
