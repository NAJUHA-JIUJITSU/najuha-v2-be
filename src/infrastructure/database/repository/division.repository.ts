import { Injectable } from '@nestjs/common';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class DivisionRepository extends Repository<Division> {
  constructor(private dataSource: DataSource) {
    super(Division, dataSource.createEntityManager());
  }

  async saveOrFail(dto: Pick<Division, 'id'> & Omit<Partial<Division>, 'id'>): Promise<Division> {
    const entity = await this.findOne({ where: { id: dto.id } });
    // if (!entity) throw new BusinessException(DivisionsErrorMap.entityS_entity_NOT_FOUND);
    if (!entity) throw new Error('Entity not found'); //TODO: 에러 표준화
    return await this.save({ ...entity, ...dto });
  }

  async updateOrFail(dto: Pick<Division, 'id'> & Partial<Division>): Promise<void> {
    const result = await this.update({ id: dto.id }, dto);
    // if (!result.affected) throw new BusinessException(DivisionsErrorMap.entityS_entity_NOT_FOUND);
    if (!result.affected) throw new Error('Entity not found'); //TODO: 에러 표준화
  }

  async getOneOrFail({ where, relations }: FindOneOptions<Division>): Promise<Division> {
    const entity = await this.findOne({ where, relations });
    // if (!entity) throw new BusinessException(DivisionsErrorMap.entityS_entity_NOT_FOUND);
    if (!entity) throw new Error('Entity not found'); //TODO: 에러 표준화
    return entity;
  }
}
