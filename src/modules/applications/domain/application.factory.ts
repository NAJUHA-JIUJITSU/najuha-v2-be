import { Injectable } from '@nestjs/common';
import { Application } from '../../../infrastructure/database/entities/application/application.entity';
import { CreateApplicationReqDto } from '../dto/request/create-application.req.dto';
import { PlayerSnapshot } from '../../../infrastructure/database/entities/application/player-snapshot.entity';
import { ParticipationDivision } from '../../../infrastructure/database/entities/application/participation-divsion.entity';
import { ParticipationDivisionSnapshot } from '../../../infrastructure/database/entities/application/participation-division-snapshot.entity';
import { IUser } from 'src/modules/users/domain/structure/user.interface';
import { ICompetition } from 'src/modules/competitions/domain/structure/competition.interface';
import { IApplication } from './structure/application.interface';

@Injectable()
export class ApplicationFactory {
  async create(dto: CreateApplicationReqDto, user: IUser, competition: ICompetition): Promise<IApplication> {
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
