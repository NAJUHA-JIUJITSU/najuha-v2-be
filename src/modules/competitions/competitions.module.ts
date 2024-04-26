import { Module } from '@nestjs/common';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionEntity } from '../../infrastructure/database/entity/competition/competition.entity';
import { DivisionEntity } from '../../infrastructure/database/entity/competition/division.entity';
import { EarlybirdDiscountSnapshotEntity } from '../../infrastructure/database/entity/competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from '../../infrastructure/database/entity/competition/combination-discount-snapshot.entity';
import { PaymentSnapshotEntity } from '../../infrastructure/database/entity/competition/payment-snapshot.entity';
import { PriceSnapshotEntity } from '../../infrastructure/database/entity/competition/price-snapshot.entity';
import { DivisionFactory } from './domain/division.factory';
import { CompetitionPagenationRepository } from './competition-pagenation.repository';
import { CompetitionFactory } from './domain/competition.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompetitionEntity,
      DivisionEntity,
      CombinationDiscountSnapshotEntity,
      EarlybirdDiscountSnapshotEntity,
      PriceSnapshotEntity,
      PaymentSnapshotEntity,
    ]),
  ],
  controllers: [UserCompetitionsController, AdminCompetitionsController],
  providers: [CompetitionsAppService, CompetitionPagenationRepository, DivisionFactory, CompetitionFactory],
})
export class CompetitionsModule {}
