import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { UserPostsController } from './presentation/user-posts.controller';
import { PostsAppService } from './application/posts.app.service';
import { CommentsAppService } from './application/comments.app.service';
import { PostFactory } from './domain/post.factory';
import { CommentFactory } from './domain/comment.factory';

@Module({
  imports: [DatabaseModule],
  controllers: [UserPostsController],
  providers: [PostsAppService, CommentsAppService, PostFactory, CommentFactory],
})
export class PostsModule {}
