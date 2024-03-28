import { Injectable } from '@nestjs/common';
import { Application } from './entities/application.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { CreateApplicationReqDto } from '../structure/dto/request/create-application.req.dto';
import { PlayerSnapshot } from './entities/player-snapshot.entity';
import { ParticipationDivision } from './entities/participation-divsion.entity';
import { ParticipationDivisionSnapshot } from './entities/participation-division-snapshot.entity';
import { Competition } from 'src/modules/competitions/domain/entities/competition.entity';

@Injectable()
export class ApplicationFactory {
  async create(dto: CreateApplicationReqDto, user: User, competition: Competition): Promise<Application> {
    const application = new Application();
    application.userId = user.id;
    application.competitionId = competition.id;

    const playerSnapshot = new PlayerSnapshot();
    playerSnapshot.name = user.name;
    playerSnapshot.gender = user.gender;
    playerSnapshot.birth = user.birth;
    playerSnapshot.phoneNumber = user.phoneNumber;
    playerSnapshot.belt = dto.player.belt;
    playerSnapshot.network = dto.player.network;
    playerSnapshot.team = dto.player.team;
    playerSnapshot.masterName = dto.player.masterName;
    playerSnapshot.applicationId = application.id;

    application.playerSnapshots = [playerSnapshot];

    const participationDivisions = competition.divisions
      .filter((division) => dto.divisionIds.includes(division.id))
      .map((division) => {
        const participationDivision = new ParticipationDivision();
        participationDivision.applicationId = application.id;
        const participationDivisionSnapshot = new ParticipationDivisionSnapshot();
        participationDivisionSnapshot.divisionId = division.id;
        participationDivision.participationDivisionSnapshots = [participationDivisionSnapshot];
        return participationDivision;
      });
    application.participationDivisions = participationDivisions;

    return application;
  }
}
