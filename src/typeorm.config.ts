import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_DATABASE', 'postgres'),
    autoLoadEntities: true,
    synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE', false),
  }),
  // {
  //   type: 'sqlite',
  //   database: ':memory:',
  //   autoLoadEntities: true,
  //   synchronize: true,
  // }
};
