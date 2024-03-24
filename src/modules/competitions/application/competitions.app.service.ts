import { Injectable } from '@nestjs/common';
import { CreateCompetitionReqDto } from '../structure/dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../structure/dto/response/competition.res.dto';
import { UpdateCompetitionReqDto } from '../structure/dto/request/update-compoetition.req.dto';
import { FindCompetitionsResDto } from '../structure/dto/response/find-competitions.res.dto';
import { CreateDivisitonsReqDto } from '../structure/dto/request/create-divisions.req.dto';
import { CompetitionRepository } from 'src/infrastructure/database/repository/competition/competition.repository';
import { DivisionPackDomainService } from '../domain/division-pack.domain.service';
import { DivisionRepository } from '../../../infrastructure/database/repository/competition/division.repository';
import { Competition } from 'src/infrastructure/database/entities/competition/competition.entity';
import { Division } from 'src/infrastructure/database/entities/competition/division.entity';

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

  async updateCompetition(id: Competition['id'], dto: UpdateCompetitionReqDto): Promise<CompetitionResDto> {
    return await this.competitionRepository.saveCompetition({ id, ...dto });
  }

  async findCompetitions(options?: { where?: Partial<Pick<Competition, 'status'>> }): Promise<FindCompetitionsResDto> {
    return await this.competitionRepository.findCompetitons(options);
  }

  async getCompetition(options?: { where?: Partial<Pick<Competition, 'id' | 'status'>> }): Promise<Competition> {
    return await this.competitionRepository.getCompetition(options);
  }

  async updateCompetitionStatus(id: Competition['id'], status: Competition['status']): Promise<CompetitionResDto> {
    const competition = await this.competitionRepository.getCompetition({ where: { id } });
    console.log(competition.earlybirdDiscountSnapshots);
    competition.updateStatus(status);
    return await this.competitionRepository.saveCompetition(competition);
  }

  async createDivisions(id: Competition['id'], dto: CreateDivisitonsReqDto): Promise<Division[]> {
    const competiton = await this.competitionRepository.getCompetition({ where: { id } });
    const unpackedDivisions = dto.divisionPacks.reduce((acc, divisionPack) => {
      return [...acc, ...this.divisionPackDomainService.unpack(id, divisionPack)];
    }, []);

    return await this.divisionRepository.createDivisions(unpackedDivisions);
  }
}
