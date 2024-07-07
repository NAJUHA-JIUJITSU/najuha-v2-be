import {
  ApplicationsErrors,
  BusinessException,
  CommonErrors,
  CompetitionsErrors,
} from '../../../../common/response/errorResponse';
import { ICompetitionModelData, ICompetitionUpdateDto } from '../interface/competition.interface';
import { CombinationDiscountSnapshotModel } from './combination-discount-snapshot.model';
import { DivisionModel } from './division.model';
import { EarlybirdDiscountSnapshotModel } from './earlybird-discount-snapshot.model';
import { IDivision } from '../interface/division.interface';
import { RequiredAdditionalInfoModel } from './required-additional-info.model';
import { IRequiredAdditionalInfoUpdateDto } from '../interface/required-additional-info.interface';
import { CalculatePaymentService } from '../calculate-payment.domain.service';
import { CompetitionHostMapModel } from './competition-host-map.model';
import { CompetitionPosterImageModel } from './competition-poster-image.model';
import { AdditionalInfoModel } from '../../../applications/domain/model/additional-info.model';

export class CompetitionModel {
  /** properties */
  private readonly _id: ICompetitionModelData['id'];
  private readonly _competitionPaymentId: ICompetitionModelData['competitionPaymentId'];
  private readonly _createdAt: ICompetitionModelData['createdAt'];
  private readonly _updatedAt: ICompetitionModelData['updatedAt'];
  private _title: ICompetitionModelData['title'];
  private _address: ICompetitionModelData['address'];
  private _competitionDate: ICompetitionModelData['competitionDate'];
  private _registrationStartDate: ICompetitionModelData['registrationStartDate'];
  private _registrationEndDate: ICompetitionModelData['registrationEndDate'];
  private _refundDeadlineDate: ICompetitionModelData['refundDeadlineDate'];
  private _soloRegistrationAdjustmentStartDate: ICompetitionModelData['soloRegistrationAdjustmentStartDate'];
  private _soloRegistrationAdjustmentEndDate: ICompetitionModelData['soloRegistrationAdjustmentEndDate'];
  private _registrationListOpenDate: ICompetitionModelData['registrationListOpenDate'];
  private _bracketOpenDate: ICompetitionModelData['bracketOpenDate'];
  private _description: ICompetitionModelData['description'];
  private _isPartnership: ICompetitionModelData['isPartnership'];
  private _viewCount: ICompetitionModelData['viewCount'];
  private _status: ICompetitionModelData['status'];
  /** relations */
  private _divisions?: DivisionModel[];
  private _requiredAdditionalInfos?: RequiredAdditionalInfoModel[];
  private _earlybirdDiscountSnapshots?: EarlybirdDiscountSnapshotModel[];
  private _combinationDiscountSnapshots?: CombinationDiscountSnapshotModel[];
  private _competitionHostMaps?: CompetitionHostMapModel[];
  private _competitionPosterImages?: CompetitionPosterImageModel[];

  constructor(data: ICompetitionModelData) {
    this._id = data.id;
    this._competitionPaymentId = data.competitionPaymentId;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._title = data.title;
    this._address = data.address;
    this._competitionDate = data.competitionDate;
    this._registrationStartDate = data.registrationStartDate;
    this._registrationEndDate = data.registrationEndDate;
    this._refundDeadlineDate = data.refundDeadlineDate;
    this._soloRegistrationAdjustmentStartDate = data.soloRegistrationAdjustmentStartDate;
    this._soloRegistrationAdjustmentEndDate = data.soloRegistrationAdjustmentEndDate;
    this._registrationListOpenDate = data.registrationListOpenDate;
    this._bracketOpenDate = data.bracketOpenDate;
    this._description = data.description;
    this._isPartnership = data.isPartnership;
    this._viewCount = data.viewCount;
    this._status = data.status;
    this._divisions = data.divisions?.map((division) => new DivisionModel(division));
    this._earlybirdDiscountSnapshots = data.earlybirdDiscountSnapshots?.map(
      (snapshot) => new EarlybirdDiscountSnapshotModel(snapshot),
    );
    this._combinationDiscountSnapshots = data.combinationDiscountSnapshots?.map(
      (snapshot) => new CombinationDiscountSnapshotModel(snapshot),
    );
    this._requiredAdditionalInfos = data.requiredAdditionalInfos?.map((info) => new RequiredAdditionalInfoModel(info));
    this._competitionHostMaps = data.competitionHostMaps?.map((map) => new CompetitionHostMapModel(map));
    this._competitionPosterImages = data.competitionPosterImages?.map(
      (posterImage) => new CompetitionPosterImageModel(posterImage),
    );
  }

  toData(): ICompetitionModelData {
    return {
      id: this._id,
      competitionPaymentId: this._competitionPaymentId,
      title: this._title,
      address: this._address,
      competitionDate: this._competitionDate,
      registrationStartDate: this._registrationStartDate,
      registrationEndDate: this._registrationEndDate,
      refundDeadlineDate: this._refundDeadlineDate,
      soloRegistrationAdjustmentStartDate: this._soloRegistrationAdjustmentStartDate,
      soloRegistrationAdjustmentEndDate: this._soloRegistrationAdjustmentEndDate,
      registrationListOpenDate: this._registrationListOpenDate,
      bracketOpenDate: this._bracketOpenDate,
      description: this._description,
      isPartnership: this._isPartnership,
      viewCount: this._viewCount,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      divisions: this._divisions?.map((division) => division.toData()),
      earlybirdDiscountSnapshots: this._earlybirdDiscountSnapshots?.map((snapshot) => snapshot.toData()),
      combinationDiscountSnapshots: this._combinationDiscountSnapshots?.map((snapshot) => snapshot.toData()),
      requiredAdditionalInfos: this._requiredAdditionalInfos?.map((info) => info.toData()),
      competitionHostMaps: this._competitionHostMaps?.map((map) => map.toData()),
      competitionPosterImages: this._competitionPosterImages?.map((posterImage) => posterImage.toData()),
    };
  }

  get id() {
    return this._id;
  }

  get competitionPaymentId() {
    return this._competitionPaymentId;
  }

  get title() {
    return this._title;
  }

  get address() {
    return this._address;
  }

  get competitionDate() {
    return this._competitionDate;
  }

  get registrationStartDate() {
    return this._registrationStartDate;
  }

  get registrationEndDate() {
    return this._registrationEndDate;
  }

  get refundDeadlineDate() {
    return this._refundDeadlineDate;
  }

  get soloRegistrationAdjustmentStartDate() {
    return this._soloRegistrationAdjustmentStartDate;
  }

  get soloRegistrationAdjustmentEndDate() {
    return this._soloRegistrationAdjustmentEndDate;
  }

  get registrationListOpenDate() {
    return this._registrationListOpenDate;
  }

  get bracketOpenDate() {
    return this._bracketOpenDate;
  }

  get description() {
    return this._description;
  }

  get isPartnership() {
    return this._isPartnership;
  }

  get viewCount() {
    return this._viewCount;
  }

  get status() {
    return this._status;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get divisions() {
    return this._divisions;
  }

  get requiredAdditionalInfos() {
    return this._requiredAdditionalInfos;
  }

  get earlybirdDiscountSnapshots() {
    return this._earlybirdDiscountSnapshots;
  }

  get combinationDiscountSnapshots() {
    return this._combinationDiscountSnapshots;
  }

  get competitionHostMaps() {
    return this._competitionHostMaps;
  }

  get competitionPosterImages() {
    return this._competitionPosterImages;
  }

  get latestEarlybirdDiscountSnapshot(): EarlybirdDiscountSnapshotModel | null {
    if (!this._earlybirdDiscountSnapshots)
      throw new Error('earlybirdDiscountSnapshots is not initialized in CompetitionModel');
    if (this._earlybirdDiscountSnapshots.length === 0) return null;
    return this._earlybirdDiscountSnapshots[this._earlybirdDiscountSnapshots.length - 1];
  }

  get latestCombinationDiscountSnapshot(): CombinationDiscountSnapshotModel | null {
    if (!this._combinationDiscountSnapshots)
      throw new Error('combinationDiscountSnapshots is not initialized in CompetitionModel');
    if (this._combinationDiscountSnapshots.length === 0) return null;
    return this._combinationDiscountSnapshots[this._combinationDiscountSnapshots.length - 1];
  }

  update(updateDto: ICompetitionUpdateDto) {
    if (updateDto.title) this._title = updateDto.title;
    if (updateDto.address) this._address = updateDto.address;
    if (updateDto.competitionDate) this._competitionDate = updateDto.competitionDate;
    if (updateDto.registrationStartDate) this._registrationStartDate = updateDto.registrationStartDate;
    if (updateDto.registrationEndDate) this._registrationEndDate = updateDto.registrationEndDate;
    if (updateDto.refundDeadlineDate) this._refundDeadlineDate = updateDto.refundDeadlineDate;
    if (updateDto.soloRegistrationAdjustmentStartDate)
      this._soloRegistrationAdjustmentStartDate = updateDto.soloRegistrationAdjustmentStartDate;
    if (updateDto.soloRegistrationAdjustmentEndDate)
      this._soloRegistrationAdjustmentEndDate = updateDto.soloRegistrationAdjustmentEndDate;
    if (updateDto.registrationListOpenDate) this._registrationListOpenDate = updateDto.registrationListOpenDate;
    if (updateDto.bracketOpenDate) this._bracketOpenDate = updateDto.bracketOpenDate;
    if (updateDto.description) this._description = updateDto.description;
    if (updateDto.isPartnership) this._isPartnership = updateDto.isPartnership;
  }

  updateStatus(newStatus: ICompetitionModelData['status']) {
    if (newStatus === 'ACTIVE') {
      const missingProperties: string[] = [];
      if (this._title === 'DEFAULT TITLE') missingProperties.push('title');
      if (this._address === 'DEFAULT ADDRESS') missingProperties.push('address');
      if (this._competitionDate === null) missingProperties.push('competitionDate');
      if (this._registrationStartDate === null) missingProperties.push('registrationStartDate');
      if (this._registrationEndDate === null) missingProperties.push('registrationEndDate');
      if (this._refundDeadlineDate === null) missingProperties.push('refundDeadlineDate');
      if (this._description === 'DEFAULT DESCRIPTION') missingProperties.push('description');
      if (missingProperties.length > 0) {
        throw new BusinessException(
          CompetitionsErrors.COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE,
          `다음 항목을 작성해주세요: ${missingProperties.join(', ')}`,
        );
      }
    }
    this._status = newStatus;
  }

  addDivisions(newDivisions: DivisionModel[]) {
    if (!this._divisions) throw new Error('divisions is not initialized in CompetitionModel');
    const duplicatedDivisions = this._divisions.filter((division) => {
      return newDivisions.some(
        (newDivision) =>
          newDivision.category === division.category &&
          newDivision.uniform === division.uniform &&
          newDivision.gender === division.gender &&
          newDivision.belt === division.belt &&
          newDivision.weight === division.weight,
      );
    });
    if (duplicatedDivisions.length > 0) {
      throw new BusinessException(
        CompetitionsErrors.COMPETITIONS_DIVISION_DUPLICATED,
        `${duplicatedDivisions
          .map(
            (division) =>
              `${division.category} ${division.uniform} ${division.gender} ${division.belt} ${division.weight}`,
          )
          .join(', ')}`,
      );
    }
    this._divisions.push(...newDivisions);
  }

  addEarlybirdDiscountSnapshot(newEarlybirdDiscountSnapshot: EarlybirdDiscountSnapshotModel) {
    if (!this._earlybirdDiscountSnapshots)
      throw new Error('earlybirdDiscountSnapshots is not initialized in CompetitionModel');
    this._earlybirdDiscountSnapshots = [...this._earlybirdDiscountSnapshots, newEarlybirdDiscountSnapshot];
  }

  addCombinationDiscountSnapshot(newCombinationDiscountSnapshot: CombinationDiscountSnapshotModel) {
    if (!this._combinationDiscountSnapshots)
      throw new Error('combinationDiscountSnapshots is not initialized in CompetitionModel');
    this._combinationDiscountSnapshots = [...this._combinationDiscountSnapshots, newCombinationDiscountSnapshot];
  }

  updateRequiredAdditionalInfo(requiredAdditionalInfoUpdateDto: IRequiredAdditionalInfoUpdateDto) {
    if (!this._requiredAdditionalInfos)
      throw new Error('requiredAdditionalInfos is not initialized in CompetitionModel');
    const requiredAdditionalInfo = this._requiredAdditionalInfos.find(
      (info) => info.id === requiredAdditionalInfoUpdateDto.id,
    );
    if (!requiredAdditionalInfo)
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'RequiredAdditionalInfo not found');
    requiredAdditionalInfo.update(requiredAdditionalInfoUpdateDto);
  }

  deleteRequiredAdditionalInfo(requiredAdditionalInfoId: RequiredAdditionalInfoModel['id']) {
    if (!this._requiredAdditionalInfos)
      throw new Error('requiredAdditionalInfos is not initialized in CompetitionModel');
    const requiredAdditionalInfo = this._requiredAdditionalInfos.find((info) => info.id === requiredAdditionalInfoId);
    if (!requiredAdditionalInfo)
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'RequiredAdditionalInfo not found');
    requiredAdditionalInfo.delete();
  }

  validateApplicationPeriod(now = new Date()) {
    if (this._registrationStartDate && now < this._registrationStartDate)
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REGISTRATION_NOT_STARTED,
        `registrationStartDate: ${this._registrationStartDate}`,
      );
    if (this._registrationEndDate && now > this._registrationEndDate)
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REGISTRATION_ENDED,
        `registrationEndDate: ${this._registrationEndDate}`,
      );
  }

  isSoloRegistrationAdjustmentPeriod(now = new Date()) {
    return this._soloRegistrationAdjustmentStartDate && this._soloRegistrationAdjustmentEndDate
      ? now >= this._soloRegistrationAdjustmentStartDate && now <= this._soloRegistrationAdjustmentEndDate
      : false;
  }

  calculateExpectedPayment(participationDivisionIds: IDivision['id'][]) {
    if (!this._divisions) throw new Error('divisions is not initialized in CompetitionModel');
    const divisions = this._divisions.filter((division) => participationDivisionIds.includes(division.id));
    const priceSnapshots = divisions.map((division) => division.latestPriceSnapshot);
    const earlybirdDiscountSnapshot = this.latestEarlybirdDiscountSnapshot;
    const combinationDiscountSnapshot = this.latestCombinationDiscountSnapshot;
    return CalculatePaymentService.calculate(
      divisions,
      priceSnapshots,
      earlybirdDiscountSnapshot,
      combinationDiscountSnapshot,
    );
  }

  addRequiredAdditionalInfo(newRequiredAdditionalInfo: RequiredAdditionalInfoModel) {
    if (!this._requiredAdditionalInfos)
      throw new Error('requiredAdditionalInfos is not initialized in CompetitionModel');
    this._requiredAdditionalInfos.forEach((info) => {
      if (info.type === newRequiredAdditionalInfo.type) {
        throw new BusinessException(
          CompetitionsErrors.COMPETITIONS_REQUIRED_ADDITIONAL_INFO_DUPLICATED,
          `type: ${newRequiredAdditionalInfo.type}`,
        );
      }
    });
    this._requiredAdditionalInfos.push(newRequiredAdditionalInfo);
  }

  validateAdditionalInfo(additionalInfos: ReadonlyArray<AdditionalInfoModel>) {
    if (!this._requiredAdditionalInfos)
      throw new Error('requiredAdditionalInfos is not initialized in CompetitionModel');
    const requiredAdditionalInfoTypes = this._requiredAdditionalInfos.map((info) => info.type);
    const additionalInfoTypes =
      additionalInfos.map((info) => {
        return info.type;
      }) || [];
    const missingTypes = requiredAdditionalInfoTypes.filter((type) => !additionalInfoTypes.includes(type));
    if (missingTypes.length > 0) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH,
        `type: ${missingTypes.join(', ')}`,
      );
    }
  }

  getDivision(divisionId: IDivision['id']): DivisionModel {
    if (!this._divisions) throw new Error('divisions is not initialized in CompetitionModel');
    const division = this._divisions.find((division) => division.id === divisionId);
    if (!division) {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, `Not found DivisionId: ${divisionId}`);
    }
    return division;
  }

  getManyDivisions(divisionIds: IDivision['id'][]): DivisionModel[] {
    if (!this._divisions) throw new Error('divisions is not initialized in CompetitionModel');
    const divisions = this._divisions.filter((division) => divisionIds.includes(division.id));
    if (divisions.length === 0) {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, `Not found DivisionIds: ${divisionIds.join(', ')}`);
    }
    return divisions;
  }

  updatePosterImage(newPosterImage: CompetitionPosterImageModel) {
    if (!this._competitionPosterImages)
      throw new Error('competitionPosterImages is not initialized in CompetitionModel');
    this._competitionPosterImages.forEach((posterImage) => {
      posterImage.delete();
    });
    this._competitionPosterImages = [...this._competitionPosterImages, newPosterImage];
  }

  deletePosterImage() {
    if (!this._competitionPosterImages)
      throw new Error('competitionPosterImages is not initialized in CompetitionModel');
    this._competitionPosterImages.forEach((image) => {
      image.delete();
    });
  }
}
