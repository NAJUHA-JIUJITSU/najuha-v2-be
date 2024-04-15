import { Module } from '@nestjs/common';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionTable } from '../../infrastructure/database/tables/competition/competition.table';
import { DivisionTable } from '../../infrastructure/database/tables/competition/division.table';
import { EarlybirdDiscountSnapshotTable } from '../../infrastructure/database/tables/competition/earlybird-discount-snapshot.table';
import { CombinationDiscountSnapshotTable } from '../../infrastructure/database/tables/competition/combination-discount-snapshot.table';
import { CompetitionRepository } from './competition.repository';
import { PaymentSnapshotTable } from '../../infrastructure/database/tables/competition/payment-snapshot.table';
import { PriceSnapshotTable } from '../../infrastructure/database/tables/competition/price-snapshot.entity';
import { DivisionFactory } from './domain/division.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompetitionTable,
      DivisionTable,
      CombinationDiscountSnapshotTable,
      EarlybirdDiscountSnapshotTable,
      PriceSnapshotTable,
      PaymentSnapshotTable,
    ]),
  ],
  controllers: [UserCompetitionsController, AdminCompetitionsController],
  providers: [CompetitionsAppService, CompetitionRepository, DivisionFactory],
})
export class CompetitionsModule {}
