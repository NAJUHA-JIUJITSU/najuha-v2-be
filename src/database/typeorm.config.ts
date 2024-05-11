import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import appEnv from 'src/common/app-env';

const typeOrmConfig = {
  type: appEnv.dbType,
  host: appEnv.dbHost,
  port: appEnv.dbPort,
  username: appEnv.dbUsername,
  password: appEnv.dbpassword,
  database: appEnv.dbDatabase,
  synchronize: appEnv.dbSynchronize,
  entities: [__dirname + '/entity/**/*.entity{.ts,.js}'],
};

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => typeOrmConfig,
};
