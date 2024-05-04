import { Injectable } from '@nestjs/common';
import { IApplication } from './interface/application.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ulid } from 'ulid';
import {
  IParticipationDivisionInfo,
  IParticipationDivisionInfoUpdateDto,
} from './interface/participation-division-info.interface';
import { IPlayerSnapshot, IPlayerSnapshotCreateDto } from './interface/player-snapshot.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { IParticipationDivisionInfoSnapshot } from './interface/participation-division-info-snapshot.interface';
import { IAdditionalInfo, IAdditionalInfoCreateDto } from './interface/additional-info.interface';

@Injectable()
export class ApplicationFactory {
  createReadyApplication(
    userId: IUser['id'],
    competitionId: ICompetition['id'],
    divisions: IDivision[],
    applicationType: IApplication['type'],
    playerSnapshotCreateDto: IPlayerSnapshotCreateDto,
    additionalInfoCreateDtos?: IAdditionalInfoCreateDto[],
  ): IApplication {
    const applicationId = ulid();
    const playerSnapshot = this.createPlayerSnapshot(applicationId, playerSnapshotCreateDto);
    const participationDivisionInfos = this.createParticipationDivisionInfos(applicationId, divisions);
    const additionalInfos = this.createAdditionalInfos(applicationId, additionalInfoCreateDtos || []);
    return {
      id: applicationId,
      type: applicationType,
      userId,
      competitionId,
      status: 'READY',
      createdAt: new Date(),
      updatedAt: new Date(),
      playerSnapshots: [playerSnapshot],
      participationDivisionInfos,
      additionalInfos,
    };
  }

  createPlayerSnapshot(
    applicationId: IApplication['id'],
    playerSnapshotCreateDto: IPlayerSnapshotCreateDto,
  ): IPlayerSnapshot {
    return {
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
    };
  }

  createParticipationDivisionInfos(
    applicationId: IApplication['id'],
    divisions: IDivision[],
  ): IParticipationDivisionInfo[] {
    return divisions.map((division) => {
      const participationDivisionInfoId = ulid();
      const participationDivisionInfosSnapshot = this.createParticipationDivisionInfoSnapshot(
        participationDivisionInfoId,
        division,
      );
      return {
        id: participationDivisionInfoId,
        applicationId,
        participationDivisionInfoSnapshots: [participationDivisionInfosSnapshot],
        createdAt: new Date(),
      };
    });
  }

  createParticipationDivisionInfoSnapshot(
    participationDivisionInfoId: IParticipationDivisionInfo['id'],
    division: IDivision,
  ): IParticipationDivisionInfoSnapshot {
    return {
      id: ulid(),
      participationDivisionId: division.id,
      division,
      participationDivisionInfoId,
      createdAt: new Date(),
    };
  }

  createParticipationDivisionInfoSnapshots(
    divisions: IDivision[],
    participationDivisionInfoUpdateDtos: IParticipationDivisionInfoUpdateDto[],
  ): IParticipationDivisionInfoSnapshot[] {
    return participationDivisionInfoUpdateDtos.map((updateParticipationDivisionInfoDto) => {
      const division = divisions.find(
        (division) => division.id === updateParticipationDivisionInfoDto.newParticipationDivisionId,
      );
      if (!division) throw new Error('Division not found');
      return this.createParticipationDivisionInfoSnapshot(
        updateParticipationDivisionInfoDto.participationDivisionInfoId,
        division,
      );
    });
  }

  createAdditionalInfos(
    applicationId: IApplication['id'],
    additionalInfoCreateDtos: IAdditionalInfoCreateDto[],
  ): IAdditionalInfo[] {
    return additionalInfoCreateDtos.map((additionalInfoCreateDto) => {
      return {
        id: ulid(),
        applicationId,
        type: additionalInfoCreateDto.type,
        value: additionalInfoCreateDto.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  }
}
