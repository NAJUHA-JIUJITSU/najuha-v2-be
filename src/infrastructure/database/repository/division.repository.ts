import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from 'src/modules/competitions/domain/division.entity';
import { PriceSnapshot } from 'src/modules/competitions/domain/price-snapshot.entity';
import { FindOneOptions, In, Repository } from 'typeorm';

@Injectable()
export class DivisionRepository {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
    @InjectRepository(PriceSnapshot)
    private readonly priceSnapshotRepository: Repository<PriceSnapshot>,
  ) {}

  async saveOrFail(dto: Pick<Division, 'id'> & Omit<Partial<Division>, 'id'>): Promise<Division> {
    const entity = await this.divisionRepository.findOne({ where: { id: dto.id } });
    // if (!entity) throw new BusinessException(DivisionsErrorMap.entityS_entity_NOT_FOUND);
    if (!entity) throw new Error('Entity not found'); //TODO: 에러 표준화
    return await this.divisionRepository.save({ ...entity, ...dto });
  }

  async updateOrFail(dto: Pick<Division, 'id'> & Partial<Division>): Promise<void> {
    const result = await this.divisionRepository.update({ id: dto.id }, dto);
    // if (!result.affected) throw new BusinessException(DivisionsErrorMap.entityS_entity_NOT_FOUND);
    if (!result.affected) throw new Error('Entity not found'); //TODO: 에러 표준화
  }

  async getOneOrFail({ where, relations }: FindOneOptions<Division>): Promise<Division> {
    const entity = await this.divisionRepository.findOne({ where, relations });
    // if (!entity) throw new BusinessException(DivisionsErrorMap.entityS_entity_NOT_FOUND);
    if (!entity) throw new Error('Entity not found'); //TODO: 에러 표준화
    return entity;
  }

  async createDivisions(divisions: Division[]): Promise<Division[]> {
    return await this.divisionRepository.save(divisions);
  }
}
