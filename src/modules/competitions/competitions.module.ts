import { Module } from '@nestjs/common';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './domain/entities/competition.entity';
import { Division } from './domain/entities/division.entity';
import { EarlybirdDiscountSnapshot } from './domain/entities/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshot } from './domain/entities/combination-discount-snapshot.entity';
import { CompetitionRepository } from './competition.repository';
import { PaymentSnapshot } from './domain/entities/payment-snapshot.entity';
import { PriceSnapshot } from './domain/entities/price-snapshot.entity';
import { DivisionFactory } from './domain/division-factory.service';

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
  providers: [CompetitionsAppService, CompetitionRepository, DivisionFactory],
})
export class CompetitionsModule {}
