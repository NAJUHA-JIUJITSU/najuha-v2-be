import { Injectable } from '@nestjs/common';
import { IApplication } from './interface/application.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ulid } from 'ulid';
import {
  IParticipationDivisionInfo,
  IParticipationDivisionInfoUpdateDto,
} from './interface/participation-division-info.interface';
import { IPlayerSnapshotCreateDto } from './interface/player-snapshot.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { ParticipationDivisionInfoSnapshotModel } from './model/participation-division-info-snapshot.model';
import { PlayerSnapshotModel } from './model/player-snapshot.model';
import { ParticipationDivisionInfoModel } from './model/participation-division-info.model';
import { ReadyApplicationModel } from './model/ready-application.model';

@Injectable()
export class ApplicationFactory {
  createReadyApplication(
    userId: IUser['id'],
    competitionId: ICompetition['id'],
    divisions: IDivision[],
    applicationType: IApplication['type'],
    playerSnapshotCreateDto: IPlayerSnapshotCreateDto,
  ) {
    const applicationId = ulid();
    const playerSnapshot = this.createPlayerSnapshot(applicationId, playerSnapshotCreateDto);
    const participationDivisionInfos = this.createParticipationDivisionInfos(applicationId, divisions);
    return new ReadyApplicationModel({
      id: applicationId,
      type: applicationType,
      userId,
      competitionId,
      playerSnapshots: [playerSnapshot],
      participationDivisionInfos: participationDivisionInfos.map((participationDivisionInfo) =>
        participationDivisionInfo.toEntity(),
      ),
      status: 'READY',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  createPlayerSnapshot(applicationId: IApplication['id'], playerSnapshotCreateDto: IPlayerSnapshotCreateDto) {
    return new PlayerSnapshotModel({
      id: ulid(),
      applicationId,
      name: playerSnapshotCreateDto.name,
      gender: playerSnapshotCreateDto.gender,
      birth: playerSnapshotCreateDto.birth,
      phoneNumber: playerSnapshotCreateDto.phoneNumber,
      belt: playerSnapshotCreateDto.belt,
      network: playerSnapshotCreateDto.network,
      team: playerSnapshotCreateDto.team,
      masterName: playerSnapshotCreateDto.masterName,
      createdAt: new Date(),
    });
  }

  createParticipationDivisionInfos(applicationId: IApplication['id'], divisions: IDivision[]) {
    return divisions.map((division) => {
      const participationDivisionInfoId = ulid();
      const participationDivisionInfosSnapshot = this.createParticipationDivisionInfoSnapshot(
        participationDivisionInfoId,
        division,
      );
      return new ParticipationDivisionInfoModel({
        id: participationDivisionInfoId,
        applicationId,
        participationDivisionInfoSnapshots: [participationDivisionInfosSnapshot],
        createdAt: new Date(),
      });
    });
  }

  createParticipationDivisionInfoSnapshot(
    participationDivisionInfoId: IParticipationDivisionInfo['id'],
    division: IDivision,
  ) {
    return new ParticipationDivisionInfoSnapshotModel({
      id: ulid(),
      participationDivisionId: division.id,
      division,
      participationDivisionInfoId,
      createdAt: new Date(),
    });
  }

  createParticipationDivisionInfoSnapshots(
    divisions: IDivision[],
    participationDivisionInfoUpdateDtos: IParticipationDivisionInfoUpdateDto[],
  ) {
    return participationDivisionInfoUpdateDtos.map((updateParticipationDivisionInfoDto) => {
      const division = divisions.find(
        (division) => division.id === updateParticipationDivisionInfoDto.newParticipationDivisionId,
      );
      if (!division) throw new Error('Division not found');
      return new ParticipationDivisionInfoSnapshotModel(
        this.createParticipationDivisionInfoSnapshot(
          updateParticipationDivisionInfoDto.participationDivisionInfoId,
          division,
        ),
      );
    });
  }
}
