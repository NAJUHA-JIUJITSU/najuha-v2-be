import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import appEnv from '../../common/app-env';
import { PolicyEntity } from 'src/infrastructure/database/entities/policy/policy.entity';
import { PolicyConsentEntity } from 'src/infrastructure/database/entities/policy/policy-consent.entity';
import { UserEntity } from 'src/infrastructure/database/entities/user/user.entity';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition/competition.entity';
import { DivisionEntity } from 'src/infrastructure/database/entities/competition/division.entity';
import { PriceSnapshotEntity } from 'src/infrastructure/database/entities/competition/price-snapshot.entity';
import { EarlyBirdDiscountSnapshotEntity } from 'src/infrastructure/database/entities/competition/early-bird-discount-snapshot.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => ({
    type: appEnv.dbType,
    host: appEnv.dbHost,
    port: appEnv.dbPort,
    username: appEnv.dbUsername,
    password: appEnv.dbpassword,
    database: appEnv.dbDatabase,
    synchronize: appEnv.dbSynchronize,
    entities: [
      UserEntity,
      CompetitionEntity,
      DivisionEntity,
      EarlyBirdDiscountSnapshotEntity,
      PolicyEntity,
      PolicyConsentEntity,
      PriceSnapshotEntity,
    ],
    autoLoadEntities: true,
  }),
};
