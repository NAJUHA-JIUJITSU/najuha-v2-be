import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CompetitionModule } from './competition/competition.Module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전체적으로 사용하기 위해
    }),
    UserModule,
    CompetitionModule,
    AuthModule,
  ],
})
export class AppModule {}
