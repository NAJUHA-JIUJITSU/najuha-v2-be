import { Module } from '@nestjs/common';
import { PolicyConsentEntity } from './entity/policy-consent.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyConsentRepository } from './policy-consent.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PolicyConsentEntity])],
  providers: [PolicyConsentRepository],
  exports: [PolicyConsentRepository],
})
export class PolicyConsentModule {}
