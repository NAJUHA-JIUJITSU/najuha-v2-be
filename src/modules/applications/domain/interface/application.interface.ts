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
import { IApplicationOrder, IApplicationOrderModelData } from './application-order.interface';

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
   * 대회 신청 상태.
   * - READY: 결제 대기중
   * - DONE: 결제 완료
   * - PARTIAL_CANCELED: 부분 취소
   * - CANCELED: 전체 취소
   */
  status: TApplicationStatus;

  /** 참가 대회 id */
  competitionId: ICompetition['id'];

  /** 신청자 계정의 userId */
  userId: IUser['id'];

  /**
   * 예상 결제 정보.
   * - READY 상태일 때만 조회결과에 포함됩니다.
   * - 조회 시점의 부문 가격, 할인 정보를 기반으로 계산됩니다.
   */
  expectedPayment?: IExpectedPayment;

  /**
   * 참가선수 정보 스냅샷.
   * - 최소 1개 이상의 선수 정보가 포함되어야 합니다.
   * - 참가자 정보가 수정될 때마다 새로운 스냅샷이 생성됩니다.
   * - 배열의 가장 마지막 요소가 최신 정보입니다.
   */
  playerSnapshots: IPlayerSnapshot[] & tags.MinItems<1>;

  /**
   * 참가부문 정보.
   * - 최소 1개 이상의 참가부문 정보가 포함되어야 합니다.
   * - 어떤 부문에 참가할지 선택한 정보입니다.
   */
  participationDivisionInfos: IParticipationDivisionInfo[] & tags.MinItems<1>;

  /**
   * 추가정보.
   * - 대회사가 요청한 추가적인 정보를 포함합니다.
   * - 대회사가 요청한 추가정보가 없다면 빈 배열입니다.
   * - ex) 주민등록번호, 주소 등
   */
  additionaInfos: IAdditionalInfo[];

  /**
   * 해당 신청에 대한 주문 정보.
   * - 결제를 한번도 시도하지 않았다면 빈 배열입니다.
   * - 하나의 신청당 여러번의 결제 시도가 있을 수 있습니다.
   * - 각 결제 시도에 대한 정보를 포함합니다.
   * - 마지막 배열 요소가 결제 완료의 정보를 포함한다고 보장하지 않습니다.
   * - 각 요소의 isPayed, status property를 통해 결제 상태를 확인하세요.
   */
  applicationOrders?: IApplicationOrder[];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IApplicationModelData
  extends Pick<
    IApplication,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'type' | 'status' | 'competitionId' | 'userId' | 'expectedPayment'
  > {
  playerSnapshots: IPlayerSnapshotModelData[];
  participationDivisionInfos: IParticipationDivisionInfoModelData[];
  additionaInfos: IAdditionalInfoModelData[];
  applicationOrders?: IApplicationOrderModelData[];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IApplicationCreateDto {
  /** 신청자 계정의 userId */
  userId: IUser['id'];

  /** 참가할 competitionId */
  competitionId: ICompetition['id'];

  /**
   * 신청 타입.
   * - SELF: 본인 신청
   * - PROXY: 대리 신청
   */
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

type TApplicationStatus = 'READY' | 'DONE' | 'PARTIAL_CANCELED' | 'CANCELED';
