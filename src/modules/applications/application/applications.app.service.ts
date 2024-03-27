import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { CreateApplicationReqDto } from '../structure/dto/request/create-application.req.dto';
import { ApplicationRepository } from '../application.repository';
import { Application } from '../domain/entities/application.entity';
import { ParticipationDivision } from '../domain/entities/participation-divsion.entity';

@Injectable()
export class ApplicationsAppService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async createApplication(userId: User['id'], dto: CreateApplicationReqDto): Promise<Application> {
    const competition = await this.applicationRepository.getCompetition({
      where: { id: dto.competitionId, status: 'ACTIVE' },
      relations: [
        'earlybirdDiscountSnapshots',
        'combinationDiscountSnapshots',
        'divisions',
        'divisions.priceSnapshots',
      ],
    });
    console.log(competition);
    // TODO: competition.isExistDivisions(dto.divisionIds)

    const participationDivisions: ParticipationDivision[] = competition.divisions
      .filter((division) => dto.divisionIds.includes(division.id))
      .map((division) => {
        const participationDivisionSnapshot = this.applicationRepository.createParticipationDivisionSnapshot({
          division,
        });
        const participationDivision = this.applicationRepository.createParticipationDivision({
          participationDivisionSnapshots: [participationDivisionSnapshot],
          priceSnapshot: division.priceSnapshots[division.priceSnapshots.length - 1],
        });
        return participationDivision;
      });

    // const paymentSnapshot

    const user = await this.applicationRepository.getUser({ where: { id: userId } });

    const playerSnapshot = this.applicationRepository.createPlayerSnapshot({
      name: user.name,
      gender: user.gender,
      birth: user.birth,
      phoneNumber: user.phoneNumber,
      belt: dto.player.belt,
      network: dto.player.network,
      team: dto.player.team,
      masterName: dto.player.masterName,
    });

    const application = this.applicationRepository.createApplication({
      userId,
      competitionId: competition.id,
      earlybirdDiscountSnapshotId:
        competition.earlybirdDiscountSnapshots[competition.earlybirdDiscountSnapshots.length - 1].id,
      combinationDiscountSnapshotId:
        competition.combinationDiscountSnapshots[competition.combinationDiscountSnapshots.length - 1].id,
      participationDivisions,
      playerSnapshot,
      // paymentSnapshot,
    });
    console.log(application);
    return await this.applicationRepository.saveApplication(application);
  }
}
