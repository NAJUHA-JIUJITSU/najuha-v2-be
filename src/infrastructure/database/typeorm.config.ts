import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import appEnv from '../../common/app-env';
import { Policy } from 'src/modules/policy/domain/policy.entity';
import { PolicyConsent } from 'src/modules/policy/domain/policy-consent.entity';
import { EarlyBirdDiscountStrategy } from 'src/modules/competitions/domain/early-bird-discount-strategy.entity';
import { User } from 'src/modules/users/domain/user.entity';
import { Competition } from 'src/modules/competitions/domain/competition.entity';
import { Division } from 'src/modules/competitions/domain/division.entity';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => ({
    type: appEnv.dbType,
    host: appEnv.dbHost,
    port: appEnv.dbPort,
    username: appEnv.dbUsername,
    password: appEnv.dbpassword,
    database: appEnv.dbDatabase,
    synchronize: appEnv.dbSynchronize,
    entities: [User, Competition, Division, EarlyBirdDiscountStrategy, Policy, PolicyConsent],
    autoLoadEntities: true,
  }),
};
