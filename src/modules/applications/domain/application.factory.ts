import { Injectable } from '@nestjs/common';
import { ApplicationEntity } from '../../../infrastructure/database/entities/application/application.entity';
import { CreateApplicationReqDto } from '../dto/request/create-application.req.dto';
import { PlayerSnapshotEntity } from '../../../infrastructure/database/entities/application/player-snapshot.entity';
import { ParticipationDivisionEntity } from '../../../infrastructure/database/entities/application/participation-divsion.entity';
import { IUser } from 'src/modules/users/domain/structure/user.interface';
import { ICompetition } from 'src/modules/competitions/domain/structure/competition.interface';
import { IApplication } from './structure/application.interface';
import { ParticipationDivisionSnapshotEntity } from 'src/infrastructure/database/entities/application/participation-division-snapshot.entity';

@Injectable()
export class ApplicationFactory {
  create(dto: CreateApplicationReqDto, user: IUser, competition: ICompetition): IApplication {
    const application = new ApplicationEntity();
    application.userId = user.id;
    application.competitionId = competition.id;

    const playerSnapshot = new PlayerSnapshotEntity();
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
        const participationDivision = new ParticipationDivisionEntity();
        participationDivision.applicationId = application.id;
        const participationDivisionSnapshot = new ParticipationDivisionSnapshotEntity();
        participationDivisionSnapshot.divisionId = division.id;
        participationDivision.participationDivisionSnapshots = [participationDivisionSnapshot];
        return participationDivision;
      });
    application.participationDivisions = participationDivisions;

    return application;
  }
}
