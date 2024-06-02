import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';
import { IPost, IPostCreateDto, IPostUpdateDto } from './interface/post.interface';
import { IPostSnapshot } from './interface/post-snapshot.interface';
import { IPostLike, IPostLikeCreateDto } from './interface/post-like.interface';
import { IPostReport, IPostReportCreateDto } from './interface/post-report.interface';

@Injectable()
export class PostFactory {
  createPost({ userId, category, title, body }: IPostCreateDto): IPost {
    const postId = uuidv7();
    const postSnapshot = this.createPostSnapshot({ postId, title, body });
    return {
      id: postId,
      userId,
      viewCount: 0,
      status: 'ACTIVE',
      category,
      createdAt: new Date(),
      deletedAt: null,
      postSnapshots: [postSnapshot],
    };
  }

  createPostSnapshot({ postId, title, body }: IPostUpdateDto): IPostSnapshot {
    return {
      id: uuidv7(),
      postId,
      title,
      body,
      createdAt: new Date(),
    };
  }

  createPostLike({ userId, postId }: IPostLikeCreateDto): IPostLike {
    return {
      id: uuidv7(),
      userId,
      postId,
      createdAt: new Date(),
    };
  }

  createPostReport({ type, reason, userId, postId }: IPostReportCreateDto): IPostReport {
    return {
      id: uuidv7(),
      type,
      status: 'ACCEPTED',
      reason,
      userId,
      postId,
      createdAt: new Date(),
    };
  }
}
