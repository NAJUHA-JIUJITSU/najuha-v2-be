import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserPostsController } from './presentation/user-posts.controller';
import { PostsAppService } from './application/posts.app.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserPostsController],
  providers: [PostsAppService],
})
export class PostsModule {}
