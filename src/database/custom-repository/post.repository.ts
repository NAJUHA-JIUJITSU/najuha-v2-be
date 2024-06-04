import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PostEntity } from '../entity/post/post.entity';
import { FindPostsParam } from 'src/modules/posts/application/posts.app.dto';
import { IPost } from 'src/modules/posts/domain/interface/post.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { BusinessException, CommonErrors } from 'src/common/response/errorResponse';

@Injectable()
export class PostRepository extends Repository<PostEntity> {
  constructor(private dataSource: DataSource) {
    super(PostEntity, dataSource.createEntityManager());
  }

  async findPosts({ page, limit, categoryFilters, sortOption, userId }: FindPostsParam) {
    let qb = this.createQueryBuilder('post')
      .where('post.status = :status', { status: 'ACTIVE' })
      .leftJoinAndSelect('post.postSnapshots', 'postSnapshots')
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .loadRelationCountAndMap('post.likeCount', 'post.likes');

    if (userId) {
      qb = qb.leftJoinAndSelect('post.likes', 'likes', 'likes.userId = :userId', { userId: userId });
    }

    if (categoryFilters) {
      if (categoryFilters.includes('POPULAR')) {
        //POPULAR 를 포함하면 likeCount가 10 이상인 게시글만 가져온다.
        qb = qb.andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('COUNT(*)')
            .from('post_like', 'likes')
            .where('likes."postId" = post.id')
            .getQuery();
          return `(${subQuery}) >= 10`;
        });
      } else {
        //categoryFilters에 해당하는 게시글만 가져온다.
        qb = qb.andWhere('post.category IN (:...categoryFilters)', { categoryFilters });
      }
    }

    switch (sortOption) {
      case '최신순':
        qb = qb.orderBy('post.createdAt', 'DESC');
        break;
      case '조회순': //todo!!!: 조회수 기능 구현하기
        break;
      default:
        break;
    }

    return await qb
      .skip(page * limit)
      .take(limit)
      .getMany();
  }

  async getPostById(postId: IPost['id'], userId?: IUser['id']) {
    const post = this.createQueryBuilder('post')
      .where('post.id = :postId', { postId })
      .andWhere('post.status = :status', { status: 'ACTIVE' })
      .leftJoinAndSelect('post.postSnapshots', 'postSnapshots')
      .leftJoinAndSelect('post.likes', 'likes', 'likes.userId = :userId', { userId: userId })
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .loadRelationCountAndMap('post.likeCount', 'post.likes')
      .getOne();
    if (!post) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'Post not found');
    return post;
  }
}
