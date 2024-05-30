import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import appEnv from 'src/common/app-env';
import { ITemporaryUser, IUser } from 'src/modules/users/domain/interface/user.interface';
import { TemporaryUserDummyBuilder, UserDummyBuilder } from 'src/dummy/user-dummy';
import { IPolicy } from 'src/modules/policy/domain/interface/policy.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IApplication } from 'src/modules/applications/domain/interface/application.interface';
import { generateDummyCompetitions } from 'src/dummy/competition.dummy';
import { generateDummyApplications } from 'src/dummy/application.dummy';
import { UserEntity } from './entity/user/user.entity';
import { CompetitionEntity } from './entity/competition/competition.entity';
import { ApplicationEntity } from './entity/application/application.entity';
import { PolicyEntity } from './entity/policy/policy.entity';
import { DivisionEntity } from './entity/competition/division.entity';
import { EarlybirdDiscountSnapshotEntity } from './entity/competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from './entity/competition/combination-discount-snapshot.entity';
import { RequiredAdditionalInfoEntity } from './entity/competition/required-additional-info.entity';
import { PriceSnapshotEntity } from './entity/competition/price-snapshot.entity';
import { PlayerSnapshotEntity } from './entity/application/player-snapshot.entity';
import { ParticipationDivisionInfoEntity } from './entity/application/participation-division-info.entity';
import { ParticipationDivisionInfoSnapshotEntity } from './entity/application/participation-division-info-snapshot.entity';
import { AdditionalInfoEntity } from './entity/application/additional-info.entity';
import * as cliProgress from 'cli-progress';
import { dummyPolicies } from 'src/dummy/policy.dummy';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { IPriceSnapshot } from 'src/modules/competitions/domain/interface/price-snapshot.interface';
import { IEarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { ICombinationDiscountSnapshot } from 'src/modules/competitions/domain/interface/combination-discount-snapshot.interface';
import { IRequiredAdditionalInfo } from 'src/modules/competitions/domain/interface/required-addtional-info.interface';
import { IPlayerSnapshot } from 'src/modules/applications/domain/interface/player-snapshot.interface';
import { IParticipationDivisionInfo } from 'src/modules/applications/domain/interface/participation-division-info.interface';
import { IParticipationDivisionInfoSnapshot } from 'src/modules/applications/domain/interface/participation-division-info-snapshot.interface';
import { IAdditionalInfo } from 'src/modules/applications/domain/interface/additional-info.interface';
import { ICompetitionHostMap } from 'src/modules/competitions/domain/interface/competition-host-map.interface';
import { CompetitionHostMapEntity } from './entity/competition/competition-host.entity';

@Injectable()
export class DataSeederService {
  private queryRunner: QueryRunner;
  private users: (IUser | ITemporaryUser)[] = [];
  private policies: IPolicy[] = [];
  private competitions: ICompetition[] = [];
  private applications: IApplication[] = [];
  // User
  private usersToSave: (IUser | ITemporaryUser)[] = [];
  private policiesToSave: IPolicy[] = [];
  // Competition
  private competitionsToSave: ICompetition[] = [];
  private divisionsToSave: IDivision[] = [];
  private priceSnapshotsToSave: IPriceSnapshot[] = [];
  private earlybirdDiscountSnapshotsToSave: IEarlybirdDiscountSnapshot[] = [];
  private combinationDiscountSnapshotsToSave: ICombinationDiscountSnapshot[] = [];
  private requiredAdditionalInfosToSave: IRequiredAdditionalInfo[] = [];
  private competitionHostMapsToSave: ICompetitionHostMap[] = [];
  // Application
  private applicationsToSave: IApplication[] = [];
  private playerSnapshotsToSave: IPlayerSnapshot[] = [];
  private participationDivisionInfosToSave: IParticipationDivisionInfo[] = [];
  private participationDivisionInfosSnapshotsToSave: IParticipationDivisionInfoSnapshot[] = [];
  private additionalInfosToSave: IAdditionalInfo[] = [];

  constructor(private dataSource: DataSource) {
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  async seed() {
    if (appEnv.nodeEnv !== 'dev') {
      console.log('Data seeding is only available in development environment. Skipping seeding.');
      return;
    }
    if (await this.checkIfDataExists()) {
      console.log('Data already exists, skipping seeding.');
      return;
    }
    console.time('Total seeding time(prepareData + seedWithTransaction)');
    this.prepareData();
    /**
     * 아래 두 메서드중 하나를 선택하여 사용하세요.
     * seedWithTransactionSerial: 데이터를 순차적으로 삽입합니다. FK 제약 조건을 준수합니다. 약 45초 정도 소요됩니다.
     * seedWithTransactionParallel: 데이터를 병렬로 삽입합니다. FK 제약 조건을 무시합니다.  약 30초 정도 소요됩니다.
     */
    // await this.seedWithTransactionSerial();
    await this.seedWithTransactionParallel();
    console.timeEnd('Total seeding time(prepareData + seedWithTransaction)');
  }

  private async checkIfDataExists(): Promise<boolean> {
    const [userCount, policyCount, competitionCount, applicationCount] = await Promise.all([
      this.queryRunner.manager.getRepository(UserEntity).count(),
      this.queryRunner.manager.getRepository(PolicyEntity).count(),
      this.queryRunner.manager.getRepository(CompetitionEntity).count(),
      this.queryRunner.manager.getRepository(ApplicationEntity).count(),
    ]);
    return userCount > 0 || policyCount > 0 || competitionCount > 0 || applicationCount > 0;
  }

  private prepareData() {
    console.log('Preparing data...');
    console.time('Data preparation time');
    /**
     * if you want to use temporary users, use this.users = this.prepareTemporaryUsers();
     * if you want to use admin users, use this.users = this.prepareAdminUsers();
     * you can't use both at the same time. only use one of them.
     */
    // this.prepareTemporaryUsers();
    this.prepareAdminUsers();
    this.preparePolicies();
    this.prepareCompetitions();
    this.prepareApplications(this.users, this.competitions);
    console.timeEnd('Data preparation time');
  }

  private prepareTemporaryUsers() {
    console.time('Temporary users preparation time');
    const users = appEnv.adminCredentials.map((user) => {
      const { id, snsId, snsAuthProvider, name } = user;
      return new TemporaryUserDummyBuilder()
        .setName(name)
        .setId(id)
        .setSnsId(snsId)
        .setSnsAuthProvider(snsAuthProvider)
        .build();
    });
    this.users = users;
    this.usersToSave = users;
    console.timeEnd('Temporary users preparation time');
  }

  private prepareAdminUsers() {
    console.time('Admin users preparation time');
    const users = appEnv.adminCredentials.map((user) => {
      const { id, snsId, snsAuthProvider, name } = user;
      return new UserDummyBuilder()
        .setId(id)
        .setSnsId(snsId)
        .setRole('ADMIN')
        .setName(name)
        .setNickname(`${name}Nickname`)
        .setSnsAuthProvider(snsAuthProvider)
        .build();
    });
    this.users = users;
    this.usersToSave = users;
    console.timeEnd('Admin users preparation time');
  }

  private preparePolicies() {
    console.time('Policies preparation time');
    this.policies = dummyPolicies;
    this.policiesToSave = dummyPolicies;
    console.timeEnd('Policies preparation time');
  }

  private prepareCompetitions() {
    console.time('Competitions preparation time');
    const competitions = generateDummyCompetitions();
    this.competitions = competitions;
    this.competitionsToSave = competitions;
    this.divisionsToSave = competitions.flatMap((competition) => competition.divisions);
    this.priceSnapshotsToSave = this.divisionsToSave.flatMap((division) => division.priceSnapshots);
    this.earlybirdDiscountSnapshotsToSave = competitions.flatMap(
      (competition) => competition.earlybirdDiscountSnapshots,
    );
    this.combinationDiscountSnapshotsToSave = competitions.flatMap(
      (competition) => competition.combinationDiscountSnapshots,
    );
    this.requiredAdditionalInfosToSave = competitions.flatMap((competition) => competition.requiredAdditionalInfos);
    this.competitionHostMapsToSave = competitions.flatMap((competition) => competition.competitionHostMaps);
    console.timeEnd('Competitions preparation time');
  }

  private prepareApplications(users: (IUser | ITemporaryUser)[], competitions: ICompetition[]) {
    console.time('Applications preparation time');
    const applications = users.flatMap((user) =>
      competitions.flatMap((competition) => {
        if (competition.isPartnership === false) return [];
        return generateDummyApplications(user, competition);
      }),
    );
    this.applications = applications;
    this.applicationsToSave = applications;
    this.playerSnapshotsToSave = applications.flatMap((application) => application.playerSnapshots);
    this.participationDivisionInfosToSave = applications.flatMap(
      (application) => application.participationDivisionInfos,
    );
    this.participationDivisionInfosSnapshotsToSave = this.participationDivisionInfosToSave.flatMap(
      (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoSnapshots,
    );
    this.additionalInfosToSave = applications.flatMap((application) => application.additionalInfos);
    console.timeEnd('Applications preparation time');
  }

  /**
   * 병렬로 데이터를 삽입합니다.
   * 병렬로 삽입하기 위해 FK 제약 조건을 무시하고 삽입합니다.
   */
  async seedWithTransactionParallel() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      console.time('Data seeding time');
      console.log('Start seeding data...');
      await this.queryRunner.query('SET session_replication_role = replica');
      await Promise.all([
        // User
        this.batchInsert(UserEntity, this.usersToSave),
        this.batchInsert(PolicyEntity, this.policiesToSave),
        // Competition
        this.batchInsert(CompetitionEntity, this.competitionsToSave),
        this.batchInsert(DivisionEntity, this.divisionsToSave),
        this.batchInsert(PriceSnapshotEntity, this.priceSnapshotsToSave),
        this.batchInsert(EarlybirdDiscountSnapshotEntity, this.earlybirdDiscountSnapshotsToSave),
        this.batchInsert(CombinationDiscountSnapshotEntity, this.combinationDiscountSnapshotsToSave),
        this.batchInsert(RequiredAdditionalInfoEntity, this.requiredAdditionalInfosToSave),
        this.batchInsert(CompetitionHostMapEntity, this.competitionHostMapsToSave),
        // Application
        this.batchInsert(ApplicationEntity, this.applicationsToSave),
        this.batchInsert(PlayerSnapshotEntity, this.playerSnapshotsToSave),
        this.batchInsert(ParticipationDivisionInfoEntity, this.participationDivisionInfosToSave),
        this.batchInsert(ParticipationDivisionInfoSnapshotEntity, this.participationDivisionInfosSnapshotsToSave),
        this.batchInsert(AdditionalInfoEntity, this.additionalInfosToSave),
      ]);
      await this.queryRunner.query('SET session_replication_role = DEFAULT');
      await this.rebuildIndexes();
      await this.queryRunner.commitTransaction();
      console.log('Data seeding completed.');
      console.timeEnd('Data seeding time');
    } catch (error) {
      console.error('Seeding failed, rolling back.', error);
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
    }
  }

  private async rebuildIndexes() {
    console.time('Rebuilding indexes time');
    const tableNames = [
      'user',
      'policy',
      'competition',
      'division',
      'price_snapshot',
      'earlybird_discount_snapshot',
      'combination_discount_snapshot',
      'required_additional_info',
      'competition_host_map',
      'application',
      'player_snapshot',
      'participation_division_info',
      'participation_division_info_snapshot',
      'additional_info',
    ];
    for (const tableName of tableNames) {
      await this.queryRunner.query(`REINDEX TABLE "${tableName}"`);
    }
    console.timeEnd('Rebuilding indexes time');
  }

  /**
   * 순차적으로 데이터를 삽입합니다.
   * 순차적으로 삽입하기 때문에 FK 제약 조건을 검사합니다.
   */
  async seedWithTransactionSerial() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      console.time('Data seeding time');
      console.log('Start seeding data...');
      // User
      await this.batchInsert(UserEntity, this.usersToSave);
      await this.batchInsert(PolicyEntity, this.policiesToSave);
      // Competition
      await this.batchInsert(CompetitionEntity, this.competitionsToSave);
      await this.batchInsert(DivisionEntity, this.divisionsToSave);
      await this.batchInsert(PriceSnapshotEntity, this.priceSnapshotsToSave);
      await this.batchInsert(EarlybirdDiscountSnapshotEntity, this.earlybirdDiscountSnapshotsToSave);
      await this.batchInsert(CombinationDiscountSnapshotEntity, this.combinationDiscountSnapshotsToSave);
      await this.batchInsert(RequiredAdditionalInfoEntity, this.requiredAdditionalInfosToSave);
      await this.batchInsert(CompetitionHostMapEntity, this.competitionHostMapsToSave);
      // Application
      await this.batchInsert(ApplicationEntity, this.applicationsToSave);
      await this.batchInsert(PlayerSnapshotEntity, this.playerSnapshotsToSave);
      await this.batchInsert(ParticipationDivisionInfoEntity, this.participationDivisionInfosToSave);
      await this.batchInsert(ParticipationDivisionInfoSnapshotEntity, this.participationDivisionInfosSnapshotsToSave);
      await this.batchInsert(AdditionalInfoEntity, this.additionalInfosToSave);
      await this.queryRunner.commitTransaction();
      console.log('Data seeding completed.');
      console.timeEnd('Data seeding time');
    } catch (error) {
      console.error('Seeding failed, rolling back.', error);
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
    }
  }

  private async batchInsert<T>(entity: new () => T, data: any[]) {
    const entityName = entity.name;
    const batchSize = 1000;
    const progressBar = new cliProgress.SingleBar(
      {
        format: `{bar} | {entityName} | {percentage}% | {value}/{total} | {duration_formatted}`,
      },
      cliProgress.Presets.legacy,
    );
    progressBar.start(data.length, 0, { entityName });
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await this.queryRunner.manager.getRepository(entity).insert(batch);
      progressBar.update(Math.min(i + batchSize, data.length));
    }
    progressBar.stop();
  }
}
