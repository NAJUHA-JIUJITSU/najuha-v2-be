import { Injectable } from '@nestjs/common';
import { BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { FindOneOptions, Repository } from 'typeorm';
import { Competition } from '../domain/entities/competition.entity';
import { Division } from '../domain/entities/division.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompetitionsRepository {
  constructor(
    @InjectRepository(Competition)
    private readonly competitionRepository: Repository<Competition>,
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
  ) {}

  async createCompetition(dto: Partial<Competition>): Promise<Competition> {
    const competition = this.competitionRepository.create(dto);
    return await this.competitionRepository.save(competition);
  }

  async findCompetitions({ where }: FindOneOptions<Competition> = {}): Promise<Competition[]> {
    return await this.competitionRepository.find({ where });
  }

  async saveCompetitionOrFail(dto: Pick<Competition, 'id'> & Omit<Partial<Competition>, 'id'>): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({ where: { id: dto.id } });
    if (!competition) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
    return await this.competitionRepository.save({ ...competition, ...dto });
  }

  async updateCompetitoinOrFail(dto: Pick<Competition, 'id'> & Partial<Competition>): Promise<void> {
    const result = await this.competitionRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
  }

  async getOneCompetitionOrFail({ where, relations }: FindOneOptions<Competition>): Promise<Competition> {
    const competition = await this.competitionRepository.findOne({ where, relations });
    if (!competition) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
    return competition;
  }

  async createDivisions(divisions: Division[]): Promise<Division[]> {
    try {
      return await this.divisionRepository.save(divisions);
    } catch (e) {
      throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_DIVISION_SAVE_FAILED, e.detail);
    }
  }
}
