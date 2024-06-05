import { Injectable } from '@nestjs/common';
import { CompetitionRepository } from 'src/database/custom-repository/competition.repository';
import { PostRepository } from 'src/database/custom-repository/post.repository';
import { IPost } from 'src/modules/posts/domain/interface/post.interface';

@Injectable()
export class ViewCountAppService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly competitionRepository: CompetitionRepository,
  ) {}

  async incrementPostViewCount(postId: IPost['id']) {
    await this.postRepository.increment({ id: postId }, 'viewCount', 1);
  }

  async incrementCompetitionViewCount(competitionId: IPost['id']) {
    await this.competitionRepository.increment({ id: competitionId }, 'viewCount', 1);
  }
}
