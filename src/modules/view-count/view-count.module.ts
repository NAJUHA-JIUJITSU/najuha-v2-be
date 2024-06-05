import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ViewCountAppService } from './applicaiton/view-count.app.service';
import { PublicViewCountController } from './presentation/public-view-count.controller';
import { ViewCountDomainService } from './domain/view-count.domain.service';
import { UserViewCountController } from './presentation/user-view-count.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PublicViewCountController, UserViewCountController],
  providers: [ViewCountAppService, ViewCountDomainService],
})
export class ViewCountModule {}
