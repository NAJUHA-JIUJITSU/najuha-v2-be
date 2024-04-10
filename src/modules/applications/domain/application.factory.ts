import { Injectable } from '@nestjs/common';
import { IApplication } from './interface/application.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ulid } from 'ulid';
import { IParticipationDivision } from './interface/participation-division.interface';
import { IParticipationDivisionSnapshot } from './interface/participation-division-snapshot.interface';

// TODO: new 방식말고 다른방법 생각
@Injectable()
export class ApplicationFactory {
  createApplication(
    user: IApplication.Create.User,
    player: IApplication.Create.Player,
    divisionIds: IDivision['id'][],
    competition: IApplication.Create.Competition,
  ): IApplication.Create.Application {
    const applicationId = ulid();
    const playerSnapshot = this.createPlayerSnapshot(user, player, applicationId);
    const particiationDivisions = this.createParticipationDivisions(divisionIds, competition, applicationId);

    const application: IApplication.Create.Application = {
      id: applicationId,
      userId: user.id,
      competitionId: competition.id,
      playerSnapshots: [playerSnapshot],
      participationDivisions: particiationDivisions,
      status: 'READY',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return application;
  }

  createPlayerSnapshot(
    user: IApplication.Create.User,
    player: IApplication.Create.Player,
    applicationId: IApplication['id'],
  ): IApplication.Create.PlayerSnapshot {
    return {
      id: ulid(),
      name: user.name,
      gender: user.gender,
      birth: user.birth,
      phoneNumber: user.phoneNumber,
      belt: player.belt,
      network: player.network,
      team: player.team,
      masterName: player.masterName,
      applicationId: applicationId,
      createdAt: new Date(),
    };
  }

  createParticipationDivisions(
    divisionIds: IDivision['id'][],
    competition: IApplication.Create.Competition,
    applicationId: IApplication['id'],
  ): IParticipationDivision[] {
    return competition.divisions
      .filter((division) => divisionIds.includes(division.id))
      .map((division) => {
        const participationDivisionId = ulid();
        const participationDivisionSnapshot: IParticipationDivisionSnapshot = {
          id: ulid(),
          divisionId: division.id,
          participationDivisionId: participationDivisionId,
          createdAt: new Date(),
        };

        const participationDivision: IParticipationDivision = {
          id: participationDivisionId,
          applicationId,
          participationDivisionSnapshots: [participationDivisionSnapshot],
          createdAt: new Date(),
        };
        return participationDivision;
      });
  }
}
