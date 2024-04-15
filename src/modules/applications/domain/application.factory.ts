import { Injectable } from '@nestjs/common';
import { IApplication } from './interface/application.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ulid } from 'ulid';
import { IParticipationDivisionInfo } from './interface/participation-division-info.interface';
import { IPlayerSnapshot } from './interface/player-snapshot.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { ApplicationEntity } from './entity/application.entity';
import { ParticipationDivisionInfoEntity } from './entity/participation-division-info.entity';
import { ParticipationDivisionInfoSnapshotEntity } from './entity/participation-division-info-snapshot.entity';
import { PlayerSnapshotEntity } from './entity/player-snapshot.entity';
import { IParticipationDivisionInfoUpdateData } from './interface/participation-division-info-update-data.interface';

@Injectable()
export class ApplicationFactory {
  createApplication(
    user: IUser,
    createPlayerSnapshotDto: IPlayerSnapshot.CreateDto,
    participationDivisionIds: IDivision['id'][],
    competition: ICompetition,
  ): ApplicationEntity {
    const applicationId = ulid();
    const playerSnapshot = this.createPlayerSnapshot(user, createPlayerSnapshotDto, applicationId);

    const particiationDivisions = this.createParticipationDivisionInfos(
      participationDivisionIds,
      competition.divisions,
      applicationId,
    );

    return new ApplicationEntity({
      id: applicationId,
      userId: user.id,
      competitionId: competition.id,
      playerSnapshots: [playerSnapshot],
      participationDivisionInfos: particiationDivisions,
      status: 'READY',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  createPlayerSnapshot(
    user: IUser,
    createPlayerSnapshotDto: IPlayerSnapshot.CreateDto,
    applicationId: IApplication['id'],
  ): PlayerSnapshotEntity {
    return new PlayerSnapshotEntity({
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
  ): ParticipationDivisionInfoEntity[] {
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
        return new ParticipationDivisionInfoEntity(participationDivisionInfo);
      });
  }

  createParticipationDivisionInfoSnapshot(
    participationDivisionInfoId: IParticipationDivisionInfo['id'],
    division: IDivision,
    participationDivisionId: IDivision['id'],
  ): ParticipationDivisionInfoSnapshotEntity {
    return new ParticipationDivisionInfoSnapshotEntity({
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
  ): ParticipationDivisionInfoSnapshotEntity[] {
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
