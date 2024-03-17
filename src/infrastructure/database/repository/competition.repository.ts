import { Injectable } from '@nestjs/common';
import { BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { Competition } from '../../../modules/competitions/domain/entities/competition.entity';

@Injectable()
export class CompetitionRepository extends Repository<Competition> {
  constructor(private dataSource: DataSource) {
    super(Competition, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<Competition, 'id'> & Omit<Partial<Competition>, 'id'>): Promise<Competition> {
    const competition = await this.findOne({ where: { id: dto.id } });
    if (!competition) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
    return await this.save({ ...competition, ...dto });
  }

  async updateOrFail(dto: Pick<Competition, 'id'> & Partial<Competition>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
  }

  async getOneOrFail({ where, relations }: FindOneOptions<Competition>): Promise<Competition> {
    const competition = await this.findOne({ where, relations });
    if (!competition) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
    return competition;
  }
}
