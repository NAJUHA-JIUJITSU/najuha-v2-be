import { Injectable } from '@nestjs/common';
import { CreateCompetitionReqDto } from '../dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../dto/response/competition.res.dto';
import { UpdateCompetitionReqDto } from '../dto/request/update-compoetition.req.dto';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { User } from 'src/modules/users/domain/user.entity';
import { FindCompetitionsResDto } from '../dto/response/find-competitions.res.dto';
import { CreateDivisitonsReqDto } from '../dto/request/create-divisions.req.dto';
import { Division } from '../domain/entities/division.entity';
import { DivisionPack } from '../domain/entities/division-pack.entity';
import { DivisionRepository } from 'src/infrastructure/database/repository/division.repository';
import { CompetitionRepository } from 'src/infrastructure/database/repository/competition.repository';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly competitionRepository: CompetitionRepository,
    private readonly divisionRepository: DivisionRepository,
  ) {}

  async createCompetition(dto: CreateCompetitionReqDto): Promise<CompetitionResDto> {
    const competition = this.competitionRepository.create(dto);
    return await this.competitionRepository.save(competition);
  }

  async updateCompetition(id: Competition['id'], dto: UpdateCompetitionReqDto): Promise<CompetitionResDto> {
    return await this.competitionRepository.saveOrFail({ id, ...dto });
  }

  async findCompetitionsByRole(userRole: User['role']): Promise<FindCompetitionsResDto> {
    if (userRole === 'ADMIN') return await this.competitionRepository.find();
    return await this.competitionRepository.find({ where: { status: 'ACTIVE' } });
  }

  async getCompetitionByRole(userRole: User['role'], id: number): Promise<CompetitionResDto> {
    if (userRole === 'ADMIN') return await this.competitionRepository.getOneOrFail({ where: { id } });
    return await this.competitionRepository.getOneOrFail({ where: { id, status: 'ACTIVE' } });
  }

  async updateCompetitionStatus(id: Competition['id'], status: Competition['status']): Promise<CompetitionResDto> {
    const competition = await this.competitionRepository.getOneOrFail({ where: { id } });
    competition.updateStatus(status);
    await this.competitionRepository.updateOrFail(competition);
    return competition;
  }

  async createDivisions(id: Competition['id'], dto: CreateDivisitonsReqDto): Promise<Division[]> {
    const divisionPacks = dto.divisionPacks.map((pack) => new DivisionPack(pack));
    const unpackedDivisions = divisionPacks.reduce((acc, divisionPack) => {
      return [...acc, ...divisionPack.unpack(id)];
    }, []);
    return await this.divisionRepository.save(unpackedDivisions);
  }
}
