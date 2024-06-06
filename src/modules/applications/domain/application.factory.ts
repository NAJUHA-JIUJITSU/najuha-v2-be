import { Injectable } from '@nestjs/common';
import { IApplication, IApplicationCreateDto } from './interface/application.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { uuidv7 } from 'uuidv7';
import {
  IParticipationDivisionInfo,
  IParticipationDivisionInfoUpdateDto,
} from './interface/participation-division-info.interface';
import { IPlayerSnapshot, IPlayerSnapshotCreateDto } from './interface/player-snapshot.interface';
import { IParticipationDivisionInfoSnapshot } from './interface/participation-division-info-snapshot.interface';
import { IAdditionalInfo, IAdditionalInfoCreateDto } from './interface/additional-info.interface';
import { CompetitionModel } from 'src/modules/competitions/domain/model/competition.model';

@Injectable()
export class ApplicationFactory {
  createReadyApplication(
    competition: CompetitionModel,
    {
      userId,
      competitionId,
      applicationType,
      participationDivisionIds,
      playerSnapshotCreateDto,
      additionalInfoCreateDtos,
    }: IApplicationCreateDto,
  ): IApplication {
    const applicationId = uuidv7();
    const playerSnapshot = this.createPlayerSnapshot(applicationId, playerSnapshotCreateDto);
    const participationDivisionInfos = this.createParticipationDivisionInfos(
      applicationId,
      competition,
      participationDivisionIds,
    );
    const additionalInfos = this.createAdditionalInfos(applicationId, additionalInfoCreateDtos ?? []);
    return {
      id: applicationId,
      type: applicationType,
      userId,
      competitionId,
      status: 'READY',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      playerSnapshots: [playerSnapshot],
      participationDivisionInfos,
      additionalInfos,
      expectedPayment: null,
    };
  }

  createPlayerSnapshot(
    applicationId: IApplication['id'],
    playerSnapshotCreateDto: IPlayerSnapshotCreateDto,
  ): IPlayerSnapshot {
    return {
      id: uuidv7(),
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
    competition: CompetitionModel,
    participationDivisionIds: IParticipationDivisionInfo['id'][],
  ): IParticipationDivisionInfo[] {
    const divisions = competition.getManyDivisions(participationDivisionIds);
    return divisions.map((division) => {
      const participationDivisionInfoId = uuidv7();
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
      id: uuidv7(),
      participationDivisionId: division.id,
      division,
      participationDivisionInfoId,
      createdAt: new Date(),
    };
  }

  createManyParticipationDivisionInfoSnapshots(
    competition: CompetitionModel,
    participationDivisionInfoUpdateDtos: IParticipationDivisionInfoUpdateDto[],
  ): IParticipationDivisionInfoSnapshot[] {
    return participationDivisionInfoUpdateDtos.map((updateParticipationDivisionInfoDto) => {
      const division = competition.getDivision(updateParticipationDivisionInfoDto.newParticipationDivisionId);
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
        id: uuidv7(),
        applicationId,
        type: additionalInfoCreateDto.type,
        value: additionalInfoCreateDto.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  }
}
