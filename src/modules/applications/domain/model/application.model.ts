import { IApplicationModelData } from '../interface/application.interface';
import { PlayerSnapshotModel } from './player-snapshot.model';
import { ParticipationDivisionInfoModel } from './participation-division-info.model';
import { AdditionalInfoModel } from './additional-info.model';
import { ParticipationDivisionInfoSnapshotModel } from './participation-division-info-snapshot.model';
import { ApplicationsErrors, BusinessException, CommonErrors } from '../../../../common/response/errorResponse';
import { IAdditionalInfoUpdateDto } from '../interface/additional-info.interface';
import { IExpectedPayment } from '../interface/expected-payment.interface';
import { UserModel } from '../../../users/domain/model/user.model';
import { ApplicationOrderModel } from './application-order.model';
import { IApplicationOrder } from '../interface/application-order.interface';
import { TMoneyValue } from '../../../../common/common-types';
import { IParticipationDivisionInfo } from '../interface/participation-division-info.interface';
import { ApplicationOrderPaymentSnapshotModel } from './application-order-payment-snapshot.model';
import { assert } from 'typia';

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
      applicationOrders: this.applicationOrders?.map((order) => order.toData()),
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

  getPaymentKey() {
    return this.getPayedApplicationOrder().getPaymentKey();
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

  getDoneStatusParticipationDivisionInfos() {
    if (!this.participationDivisionInfos || this.participationDivisionInfos.length === 0)
      throw new Error('participationDivisionInfos is not initialized');
    return this.participationDivisionInfos.filter((info) => info.getStatus() === 'DONE');
  }

  getAdditionalInfos() {
    return this.additionaInfos;
  }

  getPayedApplicationOrder() {
    if (!this.applicationOrders || this.applicationOrders.length === 0)
      throw new Error('applicationOrders is not initialized');
    const order = this.applicationOrders.find((order) => order.getIsPayed());
    if (!order) throw new Error('Payed application order is not found');
    return order;
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

  approve(paymentKey: IApplicationOrder['paymentKey'], orderId: IApplicationOrder['orderId'], amount: TMoneyValue) {
    if (!this.applicationOrders || this.applicationOrders.length === 0)
      throw new Error('applicationOrders is not initaliazed');
    if (this.status !== 'READY') throw new Error('Application status is not READY');

    const order = this.applicationOrders.find((order) => order.getOrderId() === orderId);
    if (!order) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'ApplicationOrder not found');

    order.approve(amount, paymentKey);
    this.participationDivisionInfos.forEach((info) => info.approve());
    this.status = 'DONE';
  }

  // DONE Status --------------------------------------------------------------
  addPlayerSnapshot(newPlayerSnapshot: PlayerSnapshotModel) {
    // todo!!: 에러 표준화
    if (this.status !== 'DONE' && this.status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL1');
    this.playerSnapshots.push(newPlayerSnapshot);
  }

  addParticipationDivisionInfoSnapshots(
    newParticipationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[],
  ) {
    // todo!!: 에러 표준화
    if (this.status !== 'DONE' && this.status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL2');
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
    if (this.status !== 'DONE' && this.status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL3');
    additionalInfoUpdateDtos.forEach((updateDto) => {
      const additionalInfo = this.additionaInfos.find((info) => info.getType() === updateDto.type);
      if (!additionalInfo) throw new BusinessException(ApplicationsErrors.APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND);
      additionalInfo.updateValue(updateDto.value);
    });
  }

  addApplicationOrderPaymentSnapshot(applicationOrderPaymentSnapshot: ApplicationOrderPaymentSnapshotModel) {
    if (this.status !== 'DONE' && this.status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL4');
    this.getPayedApplicationOrder().addApplicationOrderPaymentSnapshot(applicationOrderPaymentSnapshot);
  }

  cancel(participationDivisionInfoIds: IParticipationDivisionInfo['id'][]) {
    if (this.status !== 'DONE' && this.status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL5');
    if (this.participationDivisionInfos.length === 0) throw new Error('participationDivisionInfos is not initialized');
    this.cancelParticipationDivisionInfos(participationDivisionInfoIds);
    this.cancelParticipationDivisionInfoPayment(participationDivisionInfoIds);
    this.status = assert<IApplicationModelData['status']>(this.getPayedApplicationOrder().getStatus());
  }

  private cancelParticipationDivisionInfos(participationDivisionInfoIds: IParticipationDivisionInfo['id'][]) {
    if (this.status !== 'DONE' && this.status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL6');
    if (participationDivisionInfoIds.length === 0) throw new Error('participationDivisionInfoIds is not initialized');

    participationDivisionInfoIds.forEach((participationDivisionInfoId) => {
      const participationDivisionInfo = this.participationDivisionInfos.find(
        (info) => info.getId() === participationDivisionInfoId,
      );
      if (!participationDivisionInfo)
        throw new BusinessException(ApplicationsErrors.APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND);
      participationDivisionInfo.cancel();
    });
  }

  private cancelParticipationDivisionInfoPayment(participationDivisionInfoIds: IParticipationDivisionInfo['id'][]) {
    if (this.status !== 'DONE' && this.status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL7');
    const order = this.getPayedApplicationOrder();
    order.cancelParticipationDivisionInfoPayments(participationDivisionInfoIds);
  }

  getCancelAmount() {
    return this.getPayedApplicationOrder().getCancelAmount();
  }
}
