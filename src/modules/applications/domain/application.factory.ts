import { Injectable } from '@nestjs/common';
import { IApplication } from './interface/application.interface';
import { IDivision } from 'src/modules/competitions/domain/interface/division.interface';
import { ulid } from 'ulid';
import { IParticipationDivisionInfo } from './interface/participation-division-info.interface';
import { IPlayerSnapshot } from './interface/player-snapshot.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';
import { ICompetition } from 'src/modules/competitions/domain/interface/competition.interface';
import { ParticipationDivisionInfoSnapshot } from './model/participation-division-info-snapshot.model';
import { PlayerSnapshot } from './model/player-snapshot.model';
import { ParticipationDivisionInfo } from './model/participation-division-info.model';
import { ReadyApplication } from './model/ready-application.model';

@Injectable()
export class ApplicationFactory {
  createReadyApplication(
    userId: IUser['id'],
    competitionId: ICompetition['id'],
    divisions: IDivision[],
    applicationType: IApplication['type'],
    playerSnapshotCreateDto: IPlayerSnapshot.CreateDto,
  ) {
    const applicationId = ulid();
    const playerSnapshot = this.createPlayerSnapshot(applicationId, playerSnapshotCreateDto);
    const participationDivisionInfos = this.createParticipationDivisionInfos(applicationId, divisions);
    return new ReadyApplication({
      id: applicationId,
      type: applicationType,
      userId,
      competitionId,
      playerSnapshots: [playerSnapshot],
      participationDivisionInfos: participationDivisionInfos.map((participationDivisionInfo) =>
        participationDivisionInfo.toModelValue(),
      ),
      status: 'READY',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  createPlayerSnapshot(applicationId: IApplication['id'], playerSnapshotCreateDto: IPlayerSnapshot.CreateDto) {
    return new PlayerSnapshot({
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
      return new ParticipationDivisionInfo({
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
    return new ParticipationDivisionInfoSnapshot({
      id: ulid(),
      participationDivisionId: division.id,
      division,
      participationDivisionInfoId,
      createdAt: new Date(),
    });
  }

  createParticipationDivisionInfoSnapshots(
    divisions: IDivision[],
    participationDivisionInfoUpdateDtos: IParticipationDivisionInfo.UpdateDto[],
  ) {
    return participationDivisionInfoUpdateDtos.map((updateParticipationDivisionInfoDto) => {
      const division = divisions.find(
        (division) => division.id === updateParticipationDivisionInfoDto.newParticipationDivisionId,
      );
      if (!division) throw new Error('Division not found');
      return new ParticipationDivisionInfoSnapshot(
        this.createParticipationDivisionInfoSnapshot(updateParticipationDivisionInfoDto.id, division),
      );
    });
  }
}
