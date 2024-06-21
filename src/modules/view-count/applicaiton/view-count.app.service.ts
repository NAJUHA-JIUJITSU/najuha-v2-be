import { Injectable } from '@nestjs/common';
import { CompetitionRepository } from '../../../database/custom-repository/competition.repository';
import { PostRepository } from '../../../database/custom-repository/post.repository';
import { TEntitytype } from '../domain/view-count.interface';
import { BusinessException, CommonErrors, ViewCountErrors } from '../../../common/response/errorResponse';
import { IncrementEntityViewCountParam, IncrementEntityViewCountRet } from './view-count.app.dto';
import { ViewCountHistoryProvider } from '../../../infrastructure/redis/provider/view-count-history.provider';

@Injectable()
export class ViewCountAppService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly competitionRepository: CompetitionRepository,
    private readonly viewCountHistoryProvider: ViewCountHistoryProvider,
  ) {}

  async incrementEntityViewCount({
    userCredential,
    entityType,
    entityId,
  }: IncrementEntityViewCountParam): Promise<IncrementEntityViewCountRet> {
    const repository = this.getRepository(entityType);
    await repository.findOneOrFail({ where: { id: entityId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, `${entityType} not found`);
    });
    const alreadyViewed = await this.viewCountHistoryProvider.get(userCredential, entityType, entityId);
    if (alreadyViewed)
      return {
        isIncremented: false,
        message: 'View count not incremented, already viewed',
      };
    await repository.increment({ id: entityId }, 'viewCount', 1);
    await this.viewCountHistoryProvider.set(userCredential, entityType, entityId);
    return {
      isIncremented: true,
      message: 'View count incremented',
    };
  }

  private getRepository(entityType: TEntitytype) {
    switch (entityType) {
      case 'POST':
        return this.postRepository;
      case 'COMPETITION':
        return this.competitionRepository;
      default:
        throw new BusinessException(ViewCountErrors.VIEW_COUNT_IVALID_ENTITY_TYPE);
    }
  }
}
