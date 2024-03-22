import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import appEnv from '../../common/app-env';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => ({
    type: appEnv.dbType,
    host: appEnv.dbHost,
    port: appEnv.dbPort,
    username: appEnv.dbUsername,
    password: appEnv.dbpassword,
    database: appEnv.dbDatabase,
    synchronize: appEnv.dbSynchronize,
    entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
  }),
};
