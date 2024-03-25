import { Module } from '@nestjs/common';
import { UserCompetitionsController } from 'src/modules/competitions/presentation/user-competitions.controller';
import { CompetitionsAppService } from 'src/modules/competitions/application/competitions.app.service';
import { AdminCompetitionsController } from './presentation/admin-competitions.controller';
import { DivisionPackDomainService } from './domain/division-pack.domain.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competition } from './domain/entities/competition.entity';
import { Division } from './domain/entities/division.entity';
import { EarlybirdDiscountSnapshot } from './domain/entities/early-bird-discount-snapshot.entity';
import { CombinationDiscountSnapshot } from './domain/entities/combination-discount-snapshot.entity';
import { CompetitionRepository } from './competition.repository';
import { Application } from './domain/entities/application.entity';
import { ParticipationDivision } from './domain/entities/participation-divsion.entity';
import { ParticipationDivisionSnapshot } from './domain/entities/participation-division-snapshot.entity';
import { PaymentSnapshot } from './domain/entities/payment-snapshot.entity';
import { PlayerSnapshot } from './domain/entities/player-snapshot.entity';
import { PriceSnapshot } from './domain/entities/price-snapshot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      CombinationDiscountSnapshot,
      Competition,
      Division,
      EarlybirdDiscountSnapshot,
      ParticipationDivisionSnapshot,
      ParticipationDivision,
      PaymentSnapshot,
      PlayerSnapshot,
      PriceSnapshot,
    ]),
  ],
  controllers: [UserCompetitionsController, AdminCompetitionsController],
  providers: [CompetitionsAppService, DivisionPackDomainService, CompetitionRepository],
})
export class CompetitionsModule {}
