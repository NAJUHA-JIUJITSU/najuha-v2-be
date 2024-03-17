import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { CompetitionRepository } from '../../infrastructure/database/repository/competition.repository';
import { EarlyBirdDiscountStrategy } from 'src/modules/competitions/domain/entities/early-bird-discount-strategy.entity';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';
import { DivisionRepository } from 'src/infrastructure/database/repository/division.repository';

@Module({
  controllers: [UserCompetitionsController, AdminCompetitionsController],
  providers: [CompetitionsAppService, CompetitionRepository, DivisionRepository],
})
export class CompetitionsModule {}
