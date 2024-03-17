import { Injectable } from '@nestjs/common';
import { CreateCompetitionReqDto } from '../dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../dto/response/competition.res.dto';
import { UpdateCompetitionReqDto } from '../dto/request/update-compoetition.req.dto';
import { CompetitionsRepository } from 'src/modules/competitions/repository/competitions.repository';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { User } from 'src/modules/users/domain/user.entity';
import { FindCompetitionsResDto } from '../dto/response/find-competitions.res.dto';
import { CreateDivisitonsReqDto } from '../dto/request/create-divisions.req.dto';
import { DivisonDomainService } from '../domain/services/divison.domain.service';
import { Division } from '../domain/entities/division.entity';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly competitionsRepository: CompetitionsRepository,
    private readonly divisonDomainService: DivisonDomainService,
  ) {}

  async createCompetition(dto: CreateCompetitionReqDto): Promise<CompetitionResDto> {
    return this.competitionsRepository.createCompetition(dto);
  }

  async updateCompetition(id: Competition['id'], dto: UpdateCompetitionReqDto): Promise<CompetitionResDto> {
    return await this.competitionsRepository.saveCompetitionOrFail({ id, ...dto });
  }

  async findCompetitionsByRole(userRole: User['role']): Promise<FindCompetitionsResDto> {
    if (userRole === 'ADMIN') return await this.competitionsRepository.findCompetitions();
    return await this.competitionsRepository.findCompetitions({ where: { status: 'ACTIVE' } });
  }

  async getCompetitionByRole(userRole: User['role'], id: number): Promise<CompetitionResDto> {
    if (userRole === 'ADMIN') return await this.competitionsRepository.getOneCompetitionOrFail({ where: { id } });
    return await this.competitionsRepository.getOneCompetitionOrFail({ where: { id, status: 'ACTIVE' } });
  }

  async updateCompetitionStatus(id: Competition['id'], status: Competition['status']): Promise<CompetitionResDto> {
    const competition = await this.competitionsRepository.getOneCompetitionOrFail({ where: { id } });
    competition.updateStatus(status);
    await this.competitionsRepository.updateCompetitoinOrFail(competition);
    return competition;
  }

  async createDivisions(id: Competition['id'], dto: CreateDivisitonsReqDto): Promise<Division[]> {
    const unpakedDivisions = this.divisonDomainService.unpackDivisions(id, dto.packedDivisions);
    return await this.competitionsRepository.createDivisions(unpakedDivisions);
  }
}
