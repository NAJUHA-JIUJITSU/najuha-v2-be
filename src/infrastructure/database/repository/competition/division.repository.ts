import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from 'src/infrastructure/database/entities/competition/division.entity';

@Injectable()
export class DivisionRepository {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  async createDivisions(divisions: Division[]): Promise<Division[]> {
    return await this.divisionRepository.save(divisions);
  }

  async findDivisions(options?: { where?: Partial<Pick<Division, 'competitionId'>> }): Promise<Division[]> {
    return await this.divisionRepository.find(options);
  }

  async getDivision(options?: { where?: Partial<Pick<Division, 'id' | 'competitionId'>> }): Promise<Division> {
    const division = await this.divisionRepository.findOne({ where: options?.where });
    if (!division) throw new Error(' not found'); //TODO: 에러 표준화
    return division;
  }

  async saveDivision(dto: Pick<Division, 'id'> & Partial<Division>): Promise<Division> {
    const division = await this.divisionRepository.findOne({ where: { id: dto.id } });
    if (!division) throw new Error(' not found'); //TODO: 에러 표준화
    return await this.divisionRepository.save({ ...division, ...dto });
  }

  async updateDivision(dto: Pick<Division, 'id'> & Partial<Division>): Promise<void> {
    const result = await this.divisionRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new Error(' not found'); //TODO: 에러 표준화
  }
}
