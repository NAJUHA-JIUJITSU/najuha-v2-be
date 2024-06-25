import { Injectable } from '@nestjs/common';
import { IApplication, IApplicationCreateDto, IApplicationModelData } from './interface/application.interface';
import { IDivisionModelData } from '../../competitions/domain/interface/division.interface';
import { uuidv7 } from 'uuidv7';
import {
  IParticipationDivisionInfo,
  IParticipationDivisionInfoModelData,
  IParticipationDivisionInfoUpdateDto,
} from './interface/participation-division-info.interface';
import { IPlayerSnapshotCreateDto, IPlayerSnapshotModelData } from './interface/player-snapshot.interface';
import { IParticipationDivisionInfoSnapshotModelData } from './interface/participation-division-info-snapshot.interface';
import { IAdditionalInfoCreateDto, IAdditionalInfoModelData } from './interface/additional-info.interface';
import { CompetitionModel } from '../../competitions/domain/model/competition.model';

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
  ): IApplicationModelData {
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
    };
  }

  createPlayerSnapshot(
    applicationId: IApplication['id'],
    playerSnapshotCreateDto: IPlayerSnapshotCreateDto,
  ): IPlayerSnapshotModelData {
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
  ): IParticipationDivisionInfoModelData[] {
    const divisions = competition.getManyDivisions(participationDivisionIds);
    return divisions.map((division) => {
      const participationDivisionInfoId = uuidv7();
      const participationDivisionInfosSnapshot = this.createParticipationDivisionInfoSnapshot(
        participationDivisionInfoId,
        division.toData(),
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
    division: IDivisionModelData,
  ): IParticipationDivisionInfoSnapshotModelData {
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
  ): IParticipationDivisionInfoSnapshotModelData[] {
    return participationDivisionInfoUpdateDtos.map((updateParticipationDivisionInfoDto) => {
      const division = competition.getDivision(updateParticipationDivisionInfoDto.newParticipationDivisionId);
      return this.createParticipationDivisionInfoSnapshot(
        updateParticipationDivisionInfoDto.participationDivisionInfoId,
        division.toData(),
      );
    });
  }

  createAdditionalInfos(
    applicationId: IApplication['id'],
    additionalInfoCreateDtos: IAdditionalInfoCreateDto[],
  ): IAdditionalInfoModelData[] {
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
