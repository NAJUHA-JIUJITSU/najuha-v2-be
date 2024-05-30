import { Module, OnModuleInit } from '@nestjs/common';
import { PolicyRepository } from './custom-repository/policy.repository';
import { UserRepository } from './custom-repository/user.repository';
import { PolicyConsentRepository } from './custom-repository/policy-conset.repository';
import { CompetitionRepository } from './custom-repository/competition.repository';
import { DivisionRepository } from './custom-repository/division.repository';
import { EarlybirdDiscountSnapshotRepository } from './custom-repository/earlybird-discount-snapshot.repository';
import { CombinationDiscountSnapshotRepository } from './custom-repository/combination-discount-snapshot.repository';
import { ApplicationRepository } from './custom-repository/application.repository';
import { RequiredAdditionalInfoRepository } from './custom-repository/required-addtional-info.repository';
import { DataSeederService } from './data-seeder.service';

const repositories = [
  PolicyRepository,
  UserRepository,
  PolicyConsentRepository,
  CompetitionRepository,
  DivisionRepository,
  EarlybirdDiscountSnapshotRepository,
  CombinationDiscountSnapshotRepository,
  ApplicationRepository,
  RequiredAdditionalInfoRepository,
];
@Module({
  providers: [...repositories, DataSeederService],
  exports: repositories,
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly dataSeederService: DataSeederService) {}

  async onModuleInit() {
    await this.dataSeederService.seed();
  }
}
