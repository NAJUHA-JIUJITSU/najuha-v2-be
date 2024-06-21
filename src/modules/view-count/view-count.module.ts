import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ViewCountAppService } from './applicaiton/view-count.app.service';
import { UserViewCountController } from './presentation/user-view-count.controller';
import { RedisModule } from '../../infrastructure/redis/redis.module';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [UserViewCountController],
  providers: [ViewCountAppService],
})
export class ViewCountModule {}
