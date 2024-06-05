import { Injectable } from '@nestjs/common';
import { CompetitionRepository } from 'src/database/custom-repository/competition.repository';
import { PostRepository } from 'src/database/custom-repository/post.repository';
import { ViewCountDomainService } from '../domain/view-count.domain.service';
import { TEntitytype } from '../domain/view-count.interface';
import { BusinessException, CommonErrors, ViewCountErrors } from 'src/common/response/errorResponse';
import { IncrementEntityViewCountParam } from './view-count.app.dto';

@Injectable()
export class ViewCountAppService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly competitionRepository: CompetitionRepository,
    private readonly viewCountDomainService: ViewCountDomainService,
  ) {}

  async incrementEntityViewCount({
    userCredential,
    entityType,
    entityId,
  }: IncrementEntityViewCountParam): Promise<void> {
    const repository = this.getRepository(entityType);
    await repository.findOneOrFail({ where: { id: entityId } }).catch(() => {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, `${entityType} not found`);
    });
    const canIncrement = await this.viewCountDomainService.canIncrementViewCount(userCredential, entityType, entityId);
    if (!canIncrement) throw new BusinessException(ViewCountErrors.VIEW_COUNT_ALREADY_INCREMENTED);
    await repository.increment({ id: entityId }, 'viewCount', 1);
    await this.viewCountDomainService.setViewCountIncremented(userCredential, entityType, entityId);
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
