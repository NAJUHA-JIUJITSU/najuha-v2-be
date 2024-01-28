import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import appConfig from './common/appConfig';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => ({
    type: appConfig.dbType,
    host: appConfig.dbHost,
    port: appConfig.dbPort,
    username: appConfig.dbUsername,
    password: appConfig.dbpassword,
    database: appConfig.dbDatabase,
    synchronize: appConfig.dbSynchronize,
    autoLoadEntities: true,
  }),
};
