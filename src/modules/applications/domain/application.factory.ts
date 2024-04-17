import { Injectable } from '@nestjs/common';
import { IApplication } from './interface/application.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ulid } from 'ulid';
import { IParticipationDivisionInfo } from './interface/participation-division-info.interface';
import { IPlayerSnapshot } from './interface/player-snapshot.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { ApplicationModel } from './model/application.model';
import { ParticipationDivisionInfoModel } from './model/participation-division-info.model';
import { ParticipationDivisionInfoSnapshotModel } from './model/participation-division-info-snapshot.model';
import { PlayerSnapshotModel } from './model/player-snapshot.model';
import { IParticipationDivisionInfoUpdateData } from './interface/participation-division-info-update-data.interface';

@Injectable()
export class ApplicationFactory {
  createApplication(
    user: IUser,
    createPlayerSnapshotDto: IPlayerSnapshot.CreateDto,
    participationDivisionIds: IDivision['id'][],
    applicationType: IApplication['type'],
    competition: ICompetition,
  ): ApplicationModel {
    const applicationId = ulid();
    const playerSnapshot = this.createPlayerSnapshot(user, createPlayerSnapshotDto, applicationId);

    const particiationDivisions = this.createParticipationDivisionInfos(
      participationDivisionIds,
      competition.divisions,
      applicationId,
    );

    return new ApplicationModel({
      id: applicationId,
      userId: user.id,
      competitionId: competition.id,
      playerSnapshots: [playerSnapshot],
      participationDivisionInfos: particiationDivisions,
      type: applicationType,
      status: 'READY',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  createPlayerSnapshot(
    user: IUser,
    createPlayerSnapshotDto: IPlayerSnapshot.CreateDto,
    applicationId: IApplication['id'],
  ): PlayerSnapshotModel {
    return new PlayerSnapshotModel({
      id: ulid(),
      name: user.name,
      gender: user.gender,
      birth: user.birth,
      phoneNumber: user.phoneNumber,
      belt: createPlayerSnapshotDto.belt,
      network: createPlayerSnapshotDto.network,
      team: createPlayerSnapshotDto.team,
      masterName: createPlayerSnapshotDto.masterName,
      applicationId,
      createdAt: new Date(),
    });
  }

  createParticipationDivisionInfos(
    participationDivisionIds: IDivision['id'][],
    competitionDivisions: IDivision[],
    applicationId: IApplication['id'],
  ): ParticipationDivisionInfoModel[] {
    return competitionDivisions
      .filter((division) => participationDivisionIds.includes(division.id))
      .map((division) => {
        const participationDivisionInfoId = ulid();
        const participationDivisionInfosSnapshot = this.createParticipationDivisionInfoSnapshot(
          participationDivisionInfoId,
          division,
          division.id,
        );
        const participationDivisionInfo: IParticipationDivisionInfo = {
          id: participationDivisionInfoId,
          applicationId,
          participationDivisionInfoSnapshots: [participationDivisionInfosSnapshot],
          createdAt: new Date(),
        };
        return new ParticipationDivisionInfoModel(participationDivisionInfo);
      });
  }

  createParticipationDivisionInfoSnapshot(
    participationDivisionInfoId: IParticipationDivisionInfo['id'],
    division: IDivision,
    participationDivisionId: IDivision['id'],
  ): ParticipationDivisionInfoSnapshotModel {
    return new ParticipationDivisionInfoSnapshotModel({
      id: ulid(),
      participationDivisionId,
      division,
      participationDivisionInfoId,
      createdAt: new Date(),
    });
  }

  createParticipationDivisionInfoSnapshots(
    competitionDivisions: IDivision[],
    participationDivisionInfoUpdateDataList: IParticipationDivisionInfoUpdateData[],
  ): ParticipationDivisionInfoSnapshotModel[] {
    return participationDivisionInfoUpdateDataList.map((participationDivisionInfoUpdateData) => {
      const division = competitionDivisions.find(
        (division) => division.id === participationDivisionInfoUpdateData.newParticipationDivisionId,
      );
      // TODO: 에러 표준화
      if (!division) throw new Error('Division not found');
      return this.createParticipationDivisionInfoSnapshot(
        participationDivisionInfoUpdateData.participationDivisionInfoId,
        division,
        division.id,
      );
    });
  }
}
