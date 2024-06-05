import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ViewCountAppService } from './applicaiton/view-count.app.service';
import { PublicViewCountController } from './presentation/public-view-count.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PublicViewCountController],
  providers: [ViewCountAppService],
})
export class ViewCountModule {}
