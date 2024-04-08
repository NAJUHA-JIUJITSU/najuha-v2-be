import { Injectable } from '@nestjs/common';
import { ApplicationEntity } from '../../../infrastructure/database/entities/application/application.entity';
import { PlayerSnapshotEntity } from '../../../infrastructure/database/entities/application/player-snapshot.entity';
import { ParticipationDivisionEntity } from '../../../infrastructure/database/entities/application/participation-divsion.entity';
import { IApplication } from './interface/application.interface';
import { ParticipationDivisionSnapshotEntity } from 'src/infrastructure/database/entities/application/participation-division-snapshot.entity';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';

@Injectable()
export class ApplicationFactory {
  create(
    player: IApplication.Create.Player,
    user: IApplication.Create.User,
    divisionIds: IDivision['id'][],
    competition: IApplication.Create.Competition,
  ): IApplication.Create.Application {
    const application = new ApplicationEntity();
    application.userId = user.id;
    application.competitionId = competition.id;

    // TODO: new 방식말고 다른방법 생각
    const playerSnapshot = new PlayerSnapshotEntity();
    playerSnapshot.name = user.name;
    playerSnapshot.gender = user.gender;
    playerSnapshot.birth = user.birth;
    playerSnapshot.phoneNumber = user.phoneNumber;
    playerSnapshot.belt = player.belt;
    playerSnapshot.network = player.network;
    playerSnapshot.team = player.team;
    playerSnapshot.masterName = player.masterName;
    playerSnapshot.applicationId = application.id;

    application.playerSnapshots = [playerSnapshot];

    const participationDivisions = competition.divisions
      .filter((division) => divisionIds.includes(division.id))
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
