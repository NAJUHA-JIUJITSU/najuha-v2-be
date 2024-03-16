import { Injectable } from '@nestjs/common';
import { BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { CompetitionEntity } from '../domain/competition.entity';

@Injectable()
export class CompetitionsRepository extends Repository<CompetitionEntity> {
  constructor(private dataSource: DataSource) {
    super(CompetitionEntity, dataSource.createEntityManager());
  }

  async saveOrFail(
    dto: Pick<CompetitionEntity, 'id'> & Omit<Partial<CompetitionEntity>, 'id'>,
  ): Promise<CompetitionEntity> {
    const competition = await this.findOne({ where: { id: dto.id } });
    if (!competition) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
    return await this.save({ ...competition, ...dto });
  }

  async updateOrFail(dto: Pick<CompetitionEntity, 'id'> & Partial<CompetitionEntity>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
  }

  async getOneOrFail({ where, relations }: FindOneOptions<CompetitionEntity>): Promise<CompetitionEntity> {
    const competition = await this.findOne({ where, relations });
    if (!competition) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
    return competition;
  }
}
