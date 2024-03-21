import { Injectable } from '@nestjs/common';
import { BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { Repository } from 'typeorm';
import { CompetitionEntity } from '../../entities/competition/competition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ICompetition } from 'src/modules/competitions/structure/competition.interface';

@Injectable()
export class CompetitionRepository {
  constructor(
    @InjectRepository(CompetitionEntity)
    private readonly competitionRepository: Repository<CompetitionEntity>,
  ) {}

  async createCompetition(dto: Partial<ICompetition>): Promise<ICompetition> {
    const competition = this.competitionRepository.create(dto);
    return this.competitionRepository.create(competition);
  }

  async findCompetitons(options?: { where?: Partial<Pick<ICompetition, 'status'>> }): Promise<ICompetition[]> {
    return await this.competitionRepository.find(options);
  }

  async getCompetition(options?: { where?: Partial<Pick<ICompetition, 'id' | 'status'>> }): Promise<ICompetition> {
    const competition = await this.competitionRepository.findOne({ where: options?.where });
    if (!competition) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
    return competition;
  }

  async saveCompetition(dto: Pick<ICompetition, 'id'> & Partial<ICompetition>): Promise<ICompetition> {
    const competition = await this.competitionRepository.findOne({ where: { id: dto.id } });
    if (!competition) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
    return await this.competitionRepository.save({ ...competition, ...dto });
  }

  async updateCompetition(dto: Pick<ICompetition, 'id'> & Partial<ICompetition>): Promise<void> {
    const result = await this.competitionRepository.update({ id: dto.id }, dto);
    if (!result.affected) throw new BusinessException(CompetitionsErrorMap.COMPETITIONS_COMPETITION_NOT_FOUND);
  }
}
