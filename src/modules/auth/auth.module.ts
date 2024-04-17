import { Module } from '@nestjs/common';
import { UserAuthController } from 'src/modules/auth/presentation/user-auth.controller';
import { AuthAppService } from 'src/modules/auth/application/auth.app.service';
import { SnsAuthModule } from 'src/infrastructure/sns-auth-client/sns-auth.module';
import { AuthTokenDomainService } from './domain/auth-token.domain.service';
import { UserRepository } from '../users/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/database/entity/user/user.entity';

@Module({
  imports: [SnsAuthModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserAuthController],
  providers: [AuthAppService, AuthTokenDomainService, UserRepository],
  exports: [AuthTokenDomainService],
})
export class AuthModule {}
