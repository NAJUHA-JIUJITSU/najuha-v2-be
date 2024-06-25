import { ICompetition } from '../../../competitions/domain/interface/competition.interface';
import { IUser } from '../../../users/domain/interface/user.interface';
import { IPlayerSnapshot, IPlayerSnapshotCreateDto, IPlayerSnapshotModelData } from './player-snapshot.interface';
import {
  IParticipationDivisionInfo,
  IParticipationDivisionInfoModelData,
  IParticipationDivisionInfoUpdateDto,
} from './participation-division-info.interface';
import { tags } from 'typia';
import {
  IAdditionalInfo,
  IAdditionalInfoCreateDto,
  IAdditionalInfoModelData,
  IAdditionalInfoUpdateDto,
} from './additional-info.interface';
import { TId, TDateOrStringDate } from '../../../../common/common-types';
import { IExpectedPayment } from './expected-payment.interface';
import { IDivision } from '../../../competitions/domain/interface/division.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface IApplication {
  /** UUID v7. */
  id: TId;

  /**  Created at. */
  createdAt: TDateOrStringDate;

  /** Updated at. */
  updatedAt: TDateOrStringDate;

  /** Deleted at. */
  deletedAt: TDateOrStringDate | null;

  /**
   * 본인신청과 대리신청을 구별하는 type.
   * - SELF: 본인 신청
   * - PROXY: 대리 신청
   */
  type: TApplicationType;

  /**
   * Status.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - CANCELED: 결제 취소
   */
  status: TApplicationStatus;

  /** Competition id. */
  competitionId: ICompetition['id'];

  /** User id. */
  userId: IUser['id'];

  /** Player snapshots. */
  playerSnapshots: IPlayerSnapshot[] & tags.MinItems<1>;

  /** Participation division infos. */
  participationDivisionInfos: IParticipationDivisionInfo[] & tags.MinItems<1>;

  /** Addtional infos */
  additionalInfos: IAdditionalInfo[];

  /**
   * Expected payment.
   * READY 상태일 때만 조회결과에 포함됩니다.
   */
  expectedPayment?: IExpectedPayment;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IApplicationModelData {
  id: IApplication['id'];
  createdAt: IApplication['createdAt'];
  updatedAt: IApplication['updatedAt'];
  deletedAt: IApplication['deletedAt'];
  type: IApplication['type'];
  status: IApplication['status'];
  competitionId: IApplication['competitionId'];
  userId: IApplication['userId'];
  playerSnapshots: IPlayerSnapshotModelData[];
  participationDivisionInfos: IParticipationDivisionInfoModelData[];
  additionalInfos: IAdditionalInfoModelData[];
  expectedPayment?: IExpectedPayment;
}

// ----------------------------------------------------------------------------
// Return interface
// ----------------------------------------------------------------------------
export interface IApplicationDetail extends IApplication {}

export interface IApplicationCreateDto {
  /** userId */
  userId: IUser['id'];

  /** 참가할 competitionId */
  competitionId: ICompetition['id'];

  /** application type */
  applicationType: TApplicationType;

  /**
   * - Division IDs to participate.
   * @minItems 1
   */
  participationDivisionIds: IDivision['id'][];

  /** player snapshot create dto */
  playerSnapshotCreateDto: IPlayerSnapshotCreateDto;

  /** additional info create dto array */
  additionalInfoCreateDtos?: IAdditionalInfoCreateDto[];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IDoneApplicationUpdateDto {
  /**
   * - Division info update data array.
   * @minItems 1
   */
  participationDivisionInfoUpdateDtos?: IParticipationDivisionInfoUpdateDto[];

  /** player snapshot create dto */
  playerSnapshotCreateDto?: IPlayerSnapshotCreateDto;

  /** additional info update dto array */
  additionalInfoUpdateDtos?: IAdditionalInfoUpdateDto[];
}

// ----------------------------------------------------------------------------
// Query Options
// ----------------------------------------------------------------------------
export interface IApplicationQueryOptions {
  /** 신청계정의 userId */
  userId: IUser['id'];

  /**
   * application status filter option.
   * undefined 라면 모든 상태의 application을 조회합니다.
   */
  status?: IApplication['status'];
}

// ----------------------------------------------------------------------------
// ENUM
// ----------------------------------------------------------------------------
type TApplicationType = 'SELF' | 'PROXY';

type TApplicationStatus = 'READY' | 'DONE' | 'CANCELED';
