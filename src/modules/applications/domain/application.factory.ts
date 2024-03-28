import { Injectable } from '@nestjs/common';
import { ApplicationRepository } from '../application.repository';
import { Application } from './entities/application.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { CreateApplicationReqDto } from '../structure/dto/request/create-application.req.dto';
import { PlayerSnapshot } from './entities/player-snapshot.entity';
import { ParticipationDivision } from './entities/participation-divsion.entity';
import { Division } from 'src/modules/competitions/domain/entities/division.entity';

// TODO: Transaction
@Injectable()
export class ApplicationFactory {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async create(userId: User['id'], dto: CreateApplicationReqDto): Promise<Application> {
    const user = await this.applicationRepository.getUser({ where: { id: userId } });
    const competition = await this.applicationRepository.getCompetition(dto.competitionId);

    competition.validateExistDivisions(dto.divisionIds);

    const application = await this.applicationRepository.createApplication({
      userId,
      competitionId: competition.id,
    });

    const playerSnapshot = await this.createPlayerSnapshot(user, dto, application.id);

    const participationDivisions = await Promise.all(
      competition.divisions
        .filter((division) => dto.divisionIds.includes(division.id))
        .map(async (division) => {
          const participationDivision = await this.createParticipationDivision(application.id, division.id);
          return participationDivision;
        }),
    );

    application.playerSnapshots = [playerSnapshot];
    application.participationDivisions = participationDivisions;
    return application;
  }

  private async createPlayerSnapshot(
    user: User,
    dto: CreateApplicationReqDto,
    applicationId: Application['id'],
  ): Promise<PlayerSnapshot> {
    return this.applicationRepository.createPlayerSnapshot({
      name: user.name,
      gender: user.gender,
      birth: user.birth,
      phoneNumber: user.phoneNumber,
      belt: dto.player.belt,
      network: dto.player.network,
      team: dto.player.team,
      masterName: dto.player.masterName,
      applicationId,
    });
  }

  private async createParticipationDivision(
    applicationId: Application['id'],
    divisionId: Division['id'],
  ): Promise<ParticipationDivision> {
    const participationDivision = await this.applicationRepository.createParticipationDivision({
      applicationId,
    });
    const participationDivisionSnapshot = await this.applicationRepository.createParticipationDivisionSnapshot({
      participationDivisionId: participationDivision.id,
      divisionId,
    });
    participationDivision.participationDivisionSnapshots = [participationDivisionSnapshot];
    return participationDivision;
  }
}
