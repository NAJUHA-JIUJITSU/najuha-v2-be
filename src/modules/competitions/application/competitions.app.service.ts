import { Injectable } from '@nestjs/common';
import { CompetitionsRepository } from '../../../infrastructure/database/repositories/competitions.repository';
import { CreateCompetitionReqDto } from '../dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../dto/response/competition.res.dto';
import { UpdateCompetitionReqDto } from '../dto/request/update-compoetition.req.dto';

@Injectable()
export class CompetitionsAppService {
  constructor(private readonly CompetitionsRepository: CompetitionsRepository) {}

  async createCompetition(dto: CreateCompetitionReqDto): Promise<CompetitionResDto> {
    const competition = this.CompetitionsRepository.create(dto);
    return await this.CompetitionsRepository.save(competition);
  }

  async updateCompetition(dto: UpdateCompetitionReqDto): Promise<CompetitionResDto> {
    return await this.CompetitionsRepository.saveOrFail(dto);
  }
}
