import { Injectable } from '@nestjs/common';
import { BusinessException } from 'src/common/response/errorResponse';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CompetitionEntity } from '../entities/competition.entity';

@Injectable()
export class CompetitionsRepository extends Repository<CompetitionEntity> {
  constructor(private dataSource: DataSource) {
    super(CompetitionEntity, dataSource.createEntityManager());
  }

  async saveOrFail(
    dto: Pick<CompetitionEntity, 'id'> & Omit<Partial<CompetitionEntity>, 'id'>,
  ): Promise<CompetitionEntity> {
    const competition = await this.findOne({ where: { id: dto.id } });
    if (!competition) throw new Error('Competition not found'); //TODO: 에러 표준화
    return await this.save({ ...competition, ...dto });
  }
}
