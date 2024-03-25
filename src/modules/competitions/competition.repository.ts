import { Injectable } from '@nestjs/common';
import { BusinessException, CommonErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { Competition } from './domain/entities/competition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Division } from './domain/entities/division.entity';

@Injectable()
export class CompetitionRepository {
  constructor(
    @InjectRepository(Competition)
    private readonly competitionRepository: Repository<Competition>,
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  // ----------------- Competition -----------------

  async createCompetition(dto: Partial<Competition>): Promise<Competition> {
    const competition = this.competitionRepository.create(dto);
    return await this.competitionRepository.save(competition);
  }

  async findCompetitons(options?: { where?: Partial<Pick<Competition, 'status'>> }): Promise<Competition[]> {
    return await this.competitionRepository.find(options);
  }

  async getCompetition(options?: { where?: Partial<Pick<Competition, 'id' | 'status'>> }): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({ where: options?.where });
    if (!competition) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
    return competition;
  }

  async saveCompetition(dto: Pick<Competition, 'id'> & Partial<Competition>): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({ where: { id: dto.id } });
    if (!competition) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
    return await this.competitionRepository.save({ ...competition, ...dto });
  }

  async updateCompetition(dto: Pick<Competition, 'id'> & Partial<Competition>): Promise<void> {
    const result = await this.competitionRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CommonErrorMap.ENTITY_NOT_FOUND, 'Competition not found');
  }

  // ----------------- Division -----------------

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
