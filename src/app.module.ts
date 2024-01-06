import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CompetitionModule } from './competition/competition.Module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전체적으로 사용하기 위해
    }),
    UserModule,
    CompetitionModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'your_db',
      entities: [UserEntity],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
