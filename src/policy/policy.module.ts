import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { PolicyEntity } from './entities/policy.entity';
import { PolicyConsentEntity } from './entities/policy-consent.entity';
import { PolicyService } from './policy.service';
import { PolicyConsentService } from './policy-consent.service';
import { PolicyController } from './policy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyEntity, PolicyConsentEntity, UserEntity])],
  controllers: [PolicyController],
  providers: [PolicyService, PolicyConsentService],
})
export class PolicyModule {}
