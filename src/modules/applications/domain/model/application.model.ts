import { IApplicationModelData } from '../interface/application.interface';
import { PlayerSnapshotModel } from './player-snapshot.model';
import { ParticipationDivisionInfoModel } from './participation-division-info.model';
import { AdditionalInfoModel } from './additional-info.model';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { ApplicationsErrors, BusinessException } from '../../../../common/response/errorResponse';
import { IAdditionalInfoUpdateDto } from '../interface/additional-info.interface';
import { IExpectedPayment } from '../interface/expected-payment.interface';
import { UserModel } from '../../../users/domain/model/user.model';
import { ApplicationOrderModel } from './application-order.model';
import { IApplicationOrder } from '../interface/application-order.interface';

export class ApplicationModel {
  private readonly id: IApplicationModelData['id'];
  private readonly type: IApplicationModelData['type'];
  private readonly competitionId: IApplicationModelData['competitionId'];
  private readonly userId: IApplicationModelData['userId'];
  private readonly createdAt: IApplicationModelData['createdAt'];
  private readonly updatedAt: IApplicationModelData['updatedAt'];
  private status: IApplicationModelData['status'];
  private deletedAt: IApplicationModelData['deletedAt'];
  private readonly playerSnapshots: PlayerSnapshotModel[];
  private readonly participationDivisionInfos: ParticipationDivisionInfoModel[];
  private readonly additionaInfos: AdditionalInfoModel[];
  private expectedPayment?: IExpectedPayment;
  private applicationOrders?: ApplicationOrderModel[];

  constructor(data: IApplicationModelData) {
    this.id = data.id;
    this.type = data.type;
    this.userId = data.userId;
    this.competitionId = data.competitionId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.deletedAt = data.deletedAt;
    this.status = data.status;
    this.playerSnapshots = data.playerSnapshots.map((snapshot) => new PlayerSnapshotModel(snapshot));
    this.participationDivisionInfos = data.participationDivisionInfos.map(
      (info) => new ParticipationDivisionInfoModel(info),
    );
    this.additionaInfos = data.additionalInfos.map((info) => new AdditionalInfoModel(info));
    this.applicationOrders = data.applicationOrders?.map((payment) => new ApplicationOrderModel(payment));
  }

  toData(): IApplicationModelData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      type: this.type,
      status: this.status,
      competitionId: this.competitionId,
      userId: this.userId,
      playerSnapshots: this.playerSnapshots.map((snapshot) => snapshot.toData()),
      participationDivisionInfos: this.participationDivisionInfos.map((info) => info.toData()),
      additionalInfos: this.additionaInfos.map((info) => info.toData()),
      expectedPayment: this.expectedPayment,
      applicationOrders: this.applicationOrders?.map((payment) => payment.toData()),
    };
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  getStatus() {
    return this.status;
  }

  getCompetitionId() {
    return this.competitionId;
  }

  getLatestPlayerSnapshot() {
    return this.playerSnapshots[this.playerSnapshots.length - 1];
  }

  getParticipationDivisionIds() {
    return this.participationDivisionInfos.map((info) =>
      info.getLatestParticipationDivisionInfoSnapshot().division.getId(),
    );
  }

  getParticipationDivisionInfos() {
    return this.participationDivisionInfos;
  }

  getAdditionalInfos() {
    return this.additionaInfos;
  }

  validateApplicationType(user: UserModel) {
    if (this.type === 'PROXY') return;
    const playerSnapshot = this.getLatestPlayerSnapshot();
    playerSnapshot.validateSelfApplication(user);
  }

  validateDivisionSuitability() {
    const player = this.getLatestPlayerSnapshot();
    this.participationDivisionInfos.forEach((participationDivisionInfo) => {
      participationDivisionInfo.validateDivisionSuitability(player.birth, player.gender);
    });
  }

  // READY Status -------------------------------------------------------------
  delete() {
    // todo!!: 에러 표준화
    if (this.status !== 'READY') throw new Error('Application status is not READY');
    this.deletedAt = new Date();
  }

  setExpectedPayment(expectedPayment: IExpectedPayment) {
    if (this.status !== 'READY') throw new Error('Application status is not READY');
    this.expectedPayment = expectedPayment;
  }

  getExpectedPayment() {
    if (this.status !== 'READY') throw new Error('Application status is not READY');
    if (!this.expectedPayment) throw new Error('Expected payment is not set');
    return this.expectedPayment;
  }

  addApplicationOrder(applicationOrder: ApplicationOrderModel) {
    if (this.status !== 'READY') throw new Error('Application status is not READY');
    this.applicationOrders = [...(this.applicationOrders ?? []), applicationOrder];
  }

  approve(orderId: IApplicationOrder['orderId']) {
    if (this.status !== 'READY') throw new Error('Application status is not READY');
    if (!this.applicationOrders) throw new Error('applicationOrders is not initaliazed');
    const order = this.applicationOrders.find((order) => order.getOrderId() === orderId);
    if (!order) throw new Error('Order not found');
    order.approve();
    this.participationDivisionInfos.forEach((info) => info.approve());
    this.status = 'DONE';
  }

  // DONE Status --------------------------------------------------------------
  addPlayerSnapshot(newPlayerSnapshot: PlayerSnapshotModel) {
    // todo!!: 에러 표준화
    if (this.status !== 'DONE') throw new Error('Application status is not DONE');
    this.playerSnapshots.push(newPlayerSnapshot);
  }

  addParticipationDivisionInfoSnapshots(
    newParticipationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[],
  ) {
    // todo!!: 에러 표준화
    if (this.status !== 'DONE') throw new Error('Application status is not DONE');
    newParticipationDivisionInfoSnapshots.forEach((snapshot) => {
      const participationDivisionInfo = this.participationDivisionInfos.find(
        (info) => info.getId() === snapshot.participationDivisionInfoId,
      );
      if (!participationDivisionInfo)
        throw new BusinessException(ApplicationsErrors.APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND);
      participationDivisionInfo.addParticipationDivisionInfoSnapshot(snapshot);
    });
  }

  updateAdditionalInfos(additionalInfoUpdateDtos: IAdditionalInfoUpdateDto[]) {
    // todo!!: 에러 표준화
    if (this.status !== 'DONE') throw new Error('Application status is not DONE');
    additionalInfoUpdateDtos.forEach((updateDto) => {
      const additionalInfo = this.additionaInfos.find((info) => info.getType() === updateDto.type);
      if (!additionalInfo) throw new BusinessException(ApplicationsErrors.APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND);
      additionalInfo.updateValue(updateDto.value);
    });
  }
}
