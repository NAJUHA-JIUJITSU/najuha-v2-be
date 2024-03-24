import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user/user.entity';
import { UserRepository } from './repository/user/user.repository';
import { PolicyRepository } from './repository/policy/policy.repository';
import { PolicyConsentRepository } from './repository/policy/policy-consent.repository';
import { Policy } from './entities/policy/policy.entity';
import { PolicyConsent } from './entities/policy/policy-consent.entity';
import { Competition } from './entities/competition/competition.entity';
import { Division } from './entities/competition/division.entity';
import { PriceSnapshot } from './entities/competition/price-snapshot.entity';
import { CompetitionRepository } from './repository/competition/competition.repository';
import { DivisionRepository } from './repository/competition/division.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Policy, PolicyConsent, Competition, Division, PriceSnapshot])],
  providers: [UserRepository, PolicyRepository, PolicyConsentRepository, CompetitionRepository, DivisionRepository],
  exports: [UserRepository, PolicyRepository, PolicyConsentRepository, CompetitionRepository, DivisionRepository],
})
export class DatabaseModule {}
