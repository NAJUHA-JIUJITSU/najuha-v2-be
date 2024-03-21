import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DivisionEntity } from 'src/infrastructure/database/entities/competition/division.entity';
import { IDivision } from '../../../../modules/competitions/structure/division.interface';

@Injectable()
export class DivisionRepository {
  constructor(
    @InjectRepository(DivisionEntity)
    private readonly divisionRepository: Repository<DivisionEntity>,
  ) {}

  async createDivisions(divisions: IDivision[]): Promise<IDivision[]> {
    return await this.divisionRepository.save(divisions);
  }

  async findDivisions(options?: { where?: Partial<Pick<IDivision, 'competitionId'>> }): Promise<IDivision[]> {
    return await this.divisionRepository.find(options);
  }

  async getDivision(options?: { where?: Partial<Pick<IDivision, 'id' | 'competitionId'>> }): Promise<IDivision> {
    const division = await this.divisionRepository.findOne({ where: options?.where });
    if (!division) throw new Error('Entity not found'); //TODO: 에러 표준화
    return division;
  }

  async saveDivision(dto: Pick<IDivision, 'id'> & Partial<IDivision>): Promise<IDivision> {
    const division = await this.divisionRepository.findOne({ where: { id: dto.id } });
    if (!division) throw new Error('Entity not found'); //TODO: 에러 표준화
    return await this.divisionRepository.save({ ...division, ...dto });
  }

  async updateDivision(dto: Pick<IDivision, 'id'> & Partial<IDivision>): Promise<void> {
    const result = await this.divisionRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new Error('Entity not found'); //TODO: 에러 표준화
  }
}
