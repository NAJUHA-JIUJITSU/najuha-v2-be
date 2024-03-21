import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from 'src/modules/competitions/domain/competition.entity';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { CompetitionRepository } from '../../infrastructure/database/repository/competition.repository';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { EarlyBirdDiscountStrategy } from './domain/early-bird-discount-strategy.entity';
import { Division } from './domain/division.entity';
import { PriceSnapshot } from './domain/price-snapshot.entity';
import { DivisionRepository } from 'src/infrastructure/database/repository/division.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Division, PriceSnapshot])],
  controllers: [UserCompetitionsController, AdminCompetitionsController],
  providers: [CompetitionsAppService, CompetitionRepository, DivisionRepository],
})
export class CompetitionsModule {}
