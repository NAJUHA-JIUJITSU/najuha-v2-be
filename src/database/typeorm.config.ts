import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import appEnv from 'src/common/app-env';

export const typeOrmConfig = {
  type: appEnv.dbType,
  host: appEnv.dbHost,
  port: appEnv.dbPort,
  username: appEnv.dbUsername,
  password: appEnv.dbpassword,
  database: appEnv.dbDatabase,
  synchronize: appEnv.dbSynchronize,
  entities: [__dirname + '/entity/**/*.entity{.ts,.js}'],
  // logging: true,
};

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => typeOrmConfig,
};
