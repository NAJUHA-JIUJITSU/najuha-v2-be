import { Module } from '@nestjs/common';
import { UserModule } from '..//user/user.module';
import { CompetitionService } from './competition.service';
import { CompetitionController } from './competition.controller';

@Module({
  imports: [UserModule],
  controllers: [CompetitionController],
  providers: [CompetitionService],
})
export class CompetitionModule {}
