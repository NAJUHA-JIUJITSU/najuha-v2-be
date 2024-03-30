import { Module } from '@nestjs/common';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from '../../infrastructure/database/entities/competition/competition.entity';
import { Division } from '../../infrastructure/database/entities/competition/division.entity';
import { EarlybirdDiscountSnapshot } from '../../infrastructure/database/entities/competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshot } from '../../infrastructure/database/entities/competition/combination-discount-snapshot.entity';
import { CompetitionRepository } from './competition.repository';
import { PaymentSnapshot } from '../../infrastructure/database/entities/competition/payment-snapshot.entity';
import { PriceSnapshot } from '../../infrastructure/database/entities/competition/price-snapshot.entity';
import { DivisionFactory } from './domain/division.factory';
import { CompetitionValidator } from './domain/competition-validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Competition,
      Division,
      CombinationDiscountSnapshot,
      EarlybirdDiscountSnapshot,
      PriceSnapshot,
      PaymentSnapshot,
    ]),
  ],
  controllers: [UserCompetitionsController, AdminCompetitionsController],
  providers: [CompetitionsAppService, CompetitionRepository, DivisionFactory, CompetitionValidator],
})
export class CompetitionsModule {}
