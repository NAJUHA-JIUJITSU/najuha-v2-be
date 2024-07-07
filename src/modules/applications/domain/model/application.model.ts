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
import { IApplicationOrderModelData } from '../interface/application-order.interface';
import { TMoneyValue } from '../../../../common/common-types';
import { IParticipationDivisionInfoModelData } from '../interface/participation-division-info.interface';
import { ApplicationOrderPaymentSnapshotModel } from './application-order-payment-snapshot.model';
import { assert } from 'typia';

export class ApplicationModel {
  /** properties */
  private readonly _id: IApplicationModelData['id'];
  private readonly _type: IApplicationModelData['type'];
  private readonly _competitionId: IApplicationModelData['competitionId'];
  private readonly _userId: IApplicationModelData['userId'];
  private readonly _createdAt: IApplicationModelData['createdAt'];
  private readonly _updatedAt: IApplicationModelData['updatedAt'];
  private _deletedAt: IApplicationModelData['deletedAt'];
  private _status: IApplicationModelData['status'];
  private _expectedPayment?: IExpectedPayment;
  /** relations */
  private _additionaInfos: AdditionalInfoModel[];
  private _playerSnapshots: PlayerSnapshotModel[];
  private _participationDivisionInfos: ParticipationDivisionInfoModel[];
  private _applicationOrders?: ApplicationOrderModel[];

  constructor(data: IApplicationModelData) {
    this._id = data.id;
    this._type = data.type;
    this._userId = data.userId;
    this._competitionId = data.competitionId;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._deletedAt = data.deletedAt;
    this._status = data.status;
    this._playerSnapshots = data.playerSnapshots.map((snapshot) => new PlayerSnapshotModel(snapshot));
    this._participationDivisionInfos = data.participationDivisionInfos.map(
      (info) => new ParticipationDivisionInfoModel(info),
    );
    this._additionaInfos = data.additionaInfos.map((info) => new AdditionalInfoModel(info));
    this._applicationOrders = data.applicationOrders?.map((payment) => new ApplicationOrderModel(payment));
  }

  toData(): IApplicationModelData {
    return {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      type: this._type,
      status: this._status,
      competitionId: this._competitionId,
      userId: this._userId,
      playerSnapshots: this._playerSnapshots.map((snapshot) => snapshot.toData()),
      participationDivisionInfos: this._participationDivisionInfos.map((info) => info.toData()),
      additionaInfos: this._additionaInfos.map((info) => info.toData()),
      expectedPayment: this._expectedPayment,
      applicationOrders: this._applicationOrders?.map((order) => order.toData()),
    };
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get status() {
    return this._status;
  }

  get competitionId() {
    return this._competitionId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  get expectedPayment() {
    if (!this._expectedPayment) throw new Error('Expected payment is not set');
    return this._expectedPayment;
  }

  get additionaInfos() {
    return this._additionaInfos;
  }

  get playerSnapshots() {
    return this._playerSnapshots;
  }

  get participationDivisionInfos() {
    return this._participationDivisionInfos;
  }

  get applicationOrders() {
    return this._applicationOrders;
  }

  get latestPlayerSnapshot() {
    return this._playerSnapshots[this._playerSnapshots.length - 1];
  }

  getOriginalParticipationDivisionIds() {
    return this._participationDivisionInfos.map(
      (info) => info.getOriginParticipationDivisionInfoSnapshot().division.id,
    );
  }

  getLatestParticipationDivisionIds() {
    if (this._participationDivisionInfos.length === 0) throw new Error('participationDivisionInfos is not initialized');
    return this._participationDivisionInfos.map(
      (info) => info.getLatestParticipationDivisionInfoSnapshot().division.id,
    );
  }

  getPayedApplicationOrder() {
    if (!this._applicationOrders || this._applicationOrders.length === 0)
      throw new Error('applicationOrders is not initialized');
    const order = this._applicationOrders.find((order) => order.isPayed);
    if (!order) throw new Error('Payed application order is not found');
    return order;
  }

  // --------------------------------------------------------------------------
  // Common Method
  // --------------------------------------------------------------------------
  validateApplicationType(user: UserModel) {
    if (this._type === 'PROXY') return;
    this.latestPlayerSnapshot.validateSelfApplication(user);
  }

  validateDivisionSuitability() {
    this._participationDivisionInfos.forEach((participationDivisionInfo) => {
      participationDivisionInfo.validateDivisionSuitability(
        this.latestPlayerSnapshot.birth,
        this.latestPlayerSnapshot.gender,
      );
    });
  }

  // --------------------------------------------------------------------------
  // READY Status Method
  // --------------------------------------------------------------------------
  delete() {
    // todo!!: 에러 표준화
    if (this._status !== 'READY') throw new Error('Application status is not READY');
    this._deletedAt = new Date();
  }

  setExpectedPayment(expectedPayment: IExpectedPayment) {
    if (this._status !== 'READY') throw new Error('Application status is not READY');
    this._expectedPayment = expectedPayment;
  }

  addApplicationOrder(applicationOrder: ApplicationOrderModel) {
    if (this._status !== 'READY') throw new Error('Application status is not READY');
    this._applicationOrders = [...(this._applicationOrders ?? []), applicationOrder];
  }

  approve(
    paymentKey: IApplicationOrderModelData['paymentKey'],
    orderId: IApplicationOrderModelData['orderId'],
    amount: TMoneyValue,
  ) {
    if (!this._applicationOrders || this._applicationOrders.length === 0)
      throw new Error('applicationOrders is not initaliazed');
    if (this._status !== 'READY') throw new Error('Application status is not READY');

    const order = this._applicationOrders.find((order) => order.orderId === orderId);
    if (!order) throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'ApplicationOrder not found');

    order.approve(amount, paymentKey);
    this._participationDivisionInfos.forEach((info) => info.approve());
    this._status = 'DONE';
  }

  // --------------------------------------------------------------------------
  // DONE or PARTIAL_CANCELED Status Method
  // --------------------------------------------------------------------------
  addPlayerSnapshot(newPlayerSnapshot: PlayerSnapshotModel) {
    // todo!!: 에러 표준화
    if (this._status !== 'DONE' && this._status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL1');
    this._playerSnapshots.push(newPlayerSnapshot);
  }

  addParticipationDivisionInfoSnapshots(
    newParticipationDivisionInfoSnapshots: ParticipationDivisionInfoSnapshotModel[],
  ) {
    // todo!!: 에러 표준화
    if (this._status !== 'DONE' && this._status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL2');
    newParticipationDivisionInfoSnapshots.forEach((snapshot) => {
      const participationDivisionInfo = this._participationDivisionInfos.find(
        (info) => info.id === snapshot.participationDivisionInfoId,
      );
      if (!participationDivisionInfo)
        throw new BusinessException(ApplicationsErrors.APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND);
      participationDivisionInfo.addParticipationDivisionInfoSnapshot(snapshot);
    });
  }

  updateAdditionalInfos(additionalInfoUpdateDtos: IAdditionalInfoUpdateDto[]) {
    // todo!!: 에러 표준화
    if (this._status !== 'DONE' && this._status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL3');
    additionalInfoUpdateDtos.forEach((updateDto) => {
      const additionalInfo = this._additionaInfos.find((info) => info.type === updateDto.type);
      if (!additionalInfo) throw new BusinessException(ApplicationsErrors.APPLICATIONS_ADDITIONAL_INFO_NOT_FOUND);
      additionalInfo.updateValue(updateDto.value);
    });
  }

  addApplicationOrderPaymentSnapshot(applicationOrderPaymentSnapshot: ApplicationOrderPaymentSnapshotModel) {
    if (this._status !== 'DONE' && this._status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL4');
    this.getPayedApplicationOrder().addApplicationOrderPaymentSnapshot(applicationOrderPaymentSnapshot);
  }

  cancel(participationDivisionInfoIds: IParticipationDivisionInfoModelData['id'][]) {
    if (this._status !== 'DONE' && this._status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL5');
    if (this._participationDivisionInfos.length === 0) throw new Error('participationDivisionInfos is not initialized');
    this.cancelParticipationDivisionInfos(participationDivisionInfoIds);
    this.cancelParticipationDivisionInfoPayment(participationDivisionInfoIds);
    this._status = assert<IApplicationModelData['status']>(this.getPayedApplicationOrder().status);
  }

  private cancelParticipationDivisionInfos(participationDivisionInfoIds: IParticipationDivisionInfoModelData['id'][]) {
    if (this._status !== 'DONE' && this._status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL6');
    if (participationDivisionInfoIds.length === 0) throw new Error('participationDivisionInfoIds is not initialized');

    participationDivisionInfoIds.forEach((participationDivisionInfoId) => {
      const participationDivisionInfo = this._participationDivisionInfos.find(
        (info) => info.id === participationDivisionInfoId,
      );
      if (!participationDivisionInfo)
        throw new BusinessException(ApplicationsErrors.APPLICATIONS_PARTICIPATION_DIVISION_INFO_NOT_FOUND);
      participationDivisionInfo.cancel();
    });
  }

  private cancelParticipationDivisionInfoPayment(
    participationDivisionInfoIds: IParticipationDivisionInfoModelData['id'][],
  ) {
    if (this._status !== 'DONE' && this._status !== 'PARTIAL_CANCELED')
      throw new Error('Application status is not DONE or PARTIAL_CANCEL7');
    const order = this.getPayedApplicationOrder();
    order.cancelParticipationDivisionInfoPayments(participationDivisionInfoIds);
  }

  getCancellationInfo() {
    const payedApplicationOrder = this.getPayedApplicationOrder();
    return {
      paymentKey: payedApplicationOrder.paymentKey,
      cancelAmount: payedApplicationOrder.calculateCancelAmount(),
      cancelReason: '고객이 취소를 원함',
    };
  }
}
