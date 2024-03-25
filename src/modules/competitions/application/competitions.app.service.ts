import { Injectable } from '@nestjs/common';
import { CreateCompetitionReqDto } from '../structure/dto/request/create-competition.req.dto';
import { CompetitionResDto } from '../structure/dto/response/competition.res.dto';
import { UpdateCompetitionReqDto } from '../structure/dto/request/update-compoetition.req.dto';
import { FindCompetitionsResDto } from '../structure/dto/response/find-competitions.res.dto';
import { CreateDivisitonsReqDto } from '../structure/dto/request/create-divisions.req.dto';
import { CompetitionRepository } from 'src/modules/competitions/competition.repository';
import { DivisionPackDomainService } from '../domain/division-pack.domain.service';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';
import { EarlybirdDiscountSnapshot } from 'src/modules/competitions/domain/entities/early-bird-discount-snapshot.entity';
import { CreateEarlybirdDiscountReqDto } from '../structure/dto/request/create-earlybird-discount.req.dto';
import { CreateCombinationDiscountReqDto } from '../structure/dto/request/create-combination-discount.req.dto';
import { CombinationDiscountSnapshot } from '../domain/entities/combination-discount-snapshot.entity';

@Injectable()
export class CompetitionsAppService {
  constructor(
    private readonly competitionRepository: CompetitionRepository,
    private readonly divisionPackDomainService: DivisionPackDomainService,
  ) {}

  async createCompetition(dto: CreateCompetitionReqDto): Promise<CompetitionResDto> {
    return await this.competitionRepository.createCompetition(dto);
  }

  async updateCompetition(id: Competition['id'], dto: UpdateCompetitionReqDto): Promise<CompetitionResDto> {
    const competition = await this.competitionRepository.getCompetition({ where: { id } });
    return await this.competitionRepository.saveCompetition({ ...competition, ...dto });
  }

  async findCompetitions(options?: { where?: Partial<Pick<Competition, 'status'>> }): Promise<FindCompetitionsResDto> {
    return await this.competitionRepository.findCompetitons({
      where: options?.where,
      relations: ['earlybirdDiscountSnapshots'],
    });
  }

  async getCompetition(options?: { where?: Partial<Pick<Competition, 'id' | 'status'>> }): Promise<CompetitionResDto> {
    return await this.competitionRepository.getCompetition({
      where: options?.where,
      relations: ['divisions', 'earlybirdDiscountSnapshots', 'combinationDiscountSnapshots'],
    });
  }

  async updateCompetitionStatus(id: Competition['id'], status: Competition['status']): Promise<CompetitionResDto> {
    const competition = await this.competitionRepository.getCompetition({ where: { id } });
    competition.updateStatus(status);
    return await this.competitionRepository.saveCompetition(competition);
  }

  async createDivisions(id: Competition['id'], dto: CreateDivisitonsReqDto): Promise<Division[]> {
    const competition = await this.competitionRepository.getCompetition({ where: { id }, relations: ['divisions'] });
    const unpackedDivisions = dto.divisionPacks.reduce((acc, divisionPack) => {
      return [...acc, ...this.divisionPackDomainService.unpack(divisionPack)];
    }, []);
    competition.addDivisions(unpackedDivisions);
    return (await this.competitionRepository.saveCompetition(competition)).divisions || [];
  }

  async createEarlybirdDiscountSnapshot(
    id: Competition['id'],
    dto: CreateEarlybirdDiscountReqDto,
  ): Promise<EarlybirdDiscountSnapshot> {
    const competition = await this.competitionRepository.getCompetition({ where: { id } });
    return await this.competitionRepository.createEarlybirdDiscount(competition.id, dto);
  }

  async createCombinationDiscountSnapshot(
    id: Competition['id'],
    dto: CreateCombinationDiscountReqDto,
  ): Promise<CombinationDiscountSnapshot> {
    const competition = await this.competitionRepository.getCompetition({ where: { id } });
    return await this.competitionRepository.createCombinationDiscount(competition.id, dto);
  }
}
