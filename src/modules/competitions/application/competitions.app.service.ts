import { Injectable } from '@nestjs/common';
import { CreateCompetitionReqDto } from '../structure/dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../structure/dto/response/competition.res.dto';
import { UpdateCompetitionReqDto } from '../structure/dto/request/update-compoetition.req.dto';
import { FindCompetitionsResDto } from '../structure/dto/response/find-competitions.res.dto';
import { CreateDivisitonsReqDto } from '../structure/dto/request/create-divisions.req.dto';
import { CompetitionRepository } from 'src/infrastructure/database/repository/competition/competition.repository';
import { IDivision } from '../structure/division.interface';
import { ICompetition } from '../structure/competition.interface';
import { DivisionPackDomainService } from '../domain/division-pack.domain.service';
import { DivisionRepository } from '../../../infrastructure/database/repository/competition/division.repository';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly competitionRepository: CompetitionRepository,
    private readonly divisionRepository: DivisionRepository,
    private readonly divisionPackDomainService: DivisionPackDomainService,
  ) {}

  async createCompetition(dto: CreateCompetitionReqDto): Promise<CompetitionResDto> {
    return await this.competitionRepository.createCompetition(dto);
  }

  async updateCompetition(id: ICompetition['id'], dto: UpdateCompetitionReqDto): Promise<CompetitionResDto> {
    return await this.competitionRepository.saveCompetition({ id, ...dto });
  }

  async findCompetitions(options?: { where?: Partial<Pick<ICompetition, 'status'>> }): Promise<FindCompetitionsResDto> {
    return await this.competitionRepository.findCompetitons(options);
  }

  async getCompetition(options?: { where?: Partial<Pick<ICompetition, 'id' | 'status'>> }): Promise<ICompetition> {
    return await this.competitionRepository.getCompetition(options);
  }

  async updateCompetitionStatus(id: ICompetition['id'], status: ICompetition['status']): Promise<CompetitionResDto> {
    return await this.competitionRepository.saveCompetition({ id, status });
  }

  async createDivisions(id: ICompetition['id'], dto: CreateDivisitonsReqDto): Promise<IDivision[]> {
    const competiton = await this.competitionRepository.getCompetition({ where: { id } });
    const unpackedDivisions = dto.divisionPacks.reduce((acc, divisionPack) => {
      return [...acc, ...this.divisionPackDomainService.unpack(id, divisionPack)];
    }, []);

    return await this.divisionRepository.createDivisions(unpackedDivisions);
  }
}
