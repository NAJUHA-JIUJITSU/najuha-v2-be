import { Injectable } from '@nestjs/common';
import { CompetitionEntity } from 'src/Competitions/entities/Competition.entity';
import { CompetitionsRepository } from './competitions.repository';
// import { UpdateCompetitionDto } from './dto/update-Competition.dto';

@Injectable()
export class CompetitionsService {
  constructor(private readonly CompetitionsRepository: CompetitionsRepository) {}

  //   async createCompetition(dto: CreateCompetitionDto): Promise<CompetitionEntity> {
  //     const Competition = this.CompetitionsRepository.create(dto);
  //     return await this.CompetitionsRepository.save(Competition);
  //   }

  //   async updateCompetition(
  //     CompetitionId: CompetitionEntity['id'],
  //     dto: UpdateCompetitionDto,
  //   ): Promise<CompetitionEntity> {
  //     return await this.CompetitionsRepository.saveOrFail({ id: CompetitionId, ...dto });
  //   }

  //   async getMe(CompetitionId: CompetitionEntity['id']): Promise<CompetitionEntity> {
  //     return await this.CompetitionsRepository.getOneOrFail({ where: { id: CompetitionId } });
  //   }
}
