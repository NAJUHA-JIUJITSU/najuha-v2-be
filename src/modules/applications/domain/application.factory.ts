import { Injectable } from '@nestjs/common';
import { IApplication } from './interface/application.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ulid } from 'ulid';
import {
  IParticipationDivisionInfo,
  IParticipationDivisionInfoUpdateDto,
} from './interface/participation-division-info.interface';
import { IPlayerSnapshot, IPlayerSnapshotCreateDto } from './interface/player-snapshot.interface';
import { IParticipationDivisionInfoSnapshot } from './interface/participation-division-info-snapshot.interface';
import { IAdditionalInfo, IAdditionalInfoCreateDto } from './interface/additional-info.interface';
import { UserModel } from 'src/modules/users/domain/model/user.model';
import { CompetitionModel } from 'src/modules/competitions/domain/model/competition.model';

@Injectable()
export class ApplicationFactory {
  async createReadyApplication(
    user: UserModel,
    competition: CompetitionModel,
    applicationType: IApplication['type'],
    participationDivisionIds: IDivision['id'][],
    playerSnapshotCreateDto: IPlayerSnapshotCreateDto,
    additionalInfoCreateDtos?: IAdditionalInfoCreateDto[],
  ): Promise<IApplication> {
    const applicationId = ulid();
    const playerSnapshot = this.createPlayerSnapshot(applicationId, playerSnapshotCreateDto);
    const participationDivisionInfos = await this.createParticipationDivisionInfos(
      applicationId,
      competition,
      participationDivisionIds,
    );
    const additionalInfos = this.createAdditionalInfos(applicationId, additionalInfoCreateDtos ?? []);
    return {
      id: applicationId,
      type: applicationType,
      userId: user.getId(),
      competitionId: competition.getId(),
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

  async createParticipationDivisionInfos(
    applicationId: IApplication['id'],
    competition: CompetitionModel,
    participationDivisionIds: IParticipationDivisionInfo['id'][],
  ): Promise<IParticipationDivisionInfo[]> {
    const divisions = competition.getManyDivisions(participationDivisionIds);
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
