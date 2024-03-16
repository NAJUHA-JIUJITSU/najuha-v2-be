import { Injectable } from '@nestjs/common';
import { CreateCompetitionReqDto } from '../dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../dto/response/competition.res.dto';
import { UpdateCompetitionReqDto } from '../dto/request/update-compoetition.req.dto';
import { CompetitionsRepository } from 'src/infrastructure/database/repositories/competitions.repository';
import { CompetitionEntity } from 'src/infrastructure/database/entities/competition.entity';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

@Injectable()
export class CompetitionsAppService {
  constructor(private readonly competitionsRepository: CompetitionsRepository) {}

  async createCompetition(dto: CreateCompetitionReqDto): Promise<CompetitionResDto> {
    const competition = this.competitionsRepository.create(dto);
    return await this.competitionsRepository.save(competition);
  }

  async updateCompetition(id: CompetitionEntity['id'], dto: UpdateCompetitionReqDto): Promise<CompetitionResDto> {
    return await this.competitionsRepository.saveOrFail({ id, ...dto });
  }

  async findCompetitionsByRole(userRole: UserEntity['role']): Promise<CompetitionResDto[]> {
    if (userRole === 'ADMIN') return await this.competitionsRepository.find();
    return await this.competitionsRepository.find({ where: { status: 'ACTIVE' } });
  }

  async getCompetitionByRole(userRole: UserEntity['role'], id: number): Promise<CompetitionResDto> {
    if (userRole === 'ADMIN') return await this.competitionsRepository.getOneOrFail({ where: { id } });
    return await this.competitionsRepository.getOneOrFail({ where: { id, status: 'ACTIVE' } });
  }

  async updateCompetitionStatus(
    id: CompetitionEntity['id'],
    status: CompetitionEntity['status'],
  ): Promise<CompetitionResDto> {
    // TODO: active 조건 확인하기
    return await this.competitionsRepository.saveOrFail({ id, status });
  }
}
