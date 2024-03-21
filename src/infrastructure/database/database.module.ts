import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user/user.entity';
import { UserRepository } from './repository/user/user.repository';
import { PolicyRepository } from './repository/policy/policy.repository';
import { PolicyConsentRepository } from './repository/policy/policy-consent.repository';
import { PolicyEntity } from './entities/policy/policy.entity';
import { PolicyConsentEntity } from './entities/policy/policy-consent.entity';
import { CompetitionEntity } from './entities/competition/competition.entity';
import { DivisionEntity } from './entities/competition/division.entity';
import { PriceSnapshotEntity } from './entities/competition/price-snapshot.entity';
import { CompetitionRepository } from './repository/competition/competition.repository';
import { DivisionRepository } from './repository/competition/division.repository';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PolicyEntity,
      PolicyConsentEntity,
      CompetitionEntity,
      DivisionEntity,
      PriceSnapshotEntity,
    ]),
  ],
  providers: [UserRepository, PolicyRepository, PolicyConsentRepository, CompetitionRepository, DivisionRepository],
  exports: [UserRepository, PolicyRepository, PolicyConsentRepository, CompetitionRepository, DivisionRepository],
})
export class DatabaseModule {}
