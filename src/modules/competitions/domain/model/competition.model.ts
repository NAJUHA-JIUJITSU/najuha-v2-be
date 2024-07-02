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
import { RequiredAdditionalInfoModel } from './required-addtional-info.model';
import { IAdditionalInfoCreateDto } from '../../../applications/domain/interface/additional-info.interface';
import { IRequiredAdditionalInfoUpdateDto } from '../interface/required-addtional-info.interface';
import { CalculatePaymentService } from '../calculate-payment.domain.service';
import { CompetitionHostMapModel } from './competition-host-map.model';
import { CompetitionPosterImageModel } from './competition-poster-image.model';

export class CompetitionModel {
  private readonly id: ICompetitionModelData['id'];
  private readonly competitionPaymentId: ICompetitionModelData['competitionPaymentId'];
  private title: ICompetitionModelData['title'];
  private address: ICompetitionModelData['address'];
  private competitionDate: ICompetitionModelData['competitionDate'];
  private registrationStartDate: ICompetitionModelData['registrationStartDate'];
  private registrationEndDate: ICompetitionModelData['registrationEndDate'];
  private refundDeadlineDate: ICompetitionModelData['refundDeadlineDate'];
  private soloRegistrationAdjustmentStartDate: ICompetitionModelData['soloRegistrationAdjustmentStartDate'];
  private soloRegistrationAdjustmentEndDate: ICompetitionModelData['soloRegistrationAdjustmentEndDate'];
  private registrationListOpenDate: ICompetitionModelData['registrationListOpenDate'];
  private bracketOpenDate: ICompetitionModelData['bracketOpenDate'];
  private description: ICompetitionModelData['description'];
  private isPartnership: ICompetitionModelData['isPartnership'];
  private viewCount: ICompetitionModelData['viewCount'];
  private status: ICompetitionModelData['status'];
  private readonly createdAt: ICompetitionModelData['createdAt'];
  private readonly updatedAt: ICompetitionModelData['updatedAt'];
  private divisions?: DivisionModel[];
  private requiredAdditionalInfos?: RequiredAdditionalInfoModel[];
  private earlybirdDiscountSnapshots?: EarlybirdDiscountSnapshotModel[];
  private combinationDiscountSnapshots?: CombinationDiscountSnapshotModel[];
  private competitionHostMaps?: CompetitionHostMapModel[];
  private competitionPosterImages?: CompetitionPosterImageModel[];

  constructor(data: ICompetitionModelData) {
    this.id = data.id;
    this.competitionPaymentId = data.competitionPaymentId;
    this.title = data.title;
    this.address = data.address;
    this.competitionDate = data.competitionDate;
    this.registrationStartDate = data.registrationStartDate;
    this.registrationEndDate = data.registrationEndDate;
    this.refundDeadlineDate = data.refundDeadlineDate;
    this.soloRegistrationAdjustmentStartDate = data.soloRegistrationAdjustmentStartDate;
    this.soloRegistrationAdjustmentEndDate = data.soloRegistrationAdjustmentEndDate;
    this.registrationListOpenDate = data.registrationListOpenDate;
    this.bracketOpenDate = data.bracketOpenDate;
    this.description = data.description;
    this.isPartnership = data.isPartnership;
    this.viewCount = data.viewCount;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.divisions = data.divisions?.map((division) => new DivisionModel(division));
    this.earlybirdDiscountSnapshots = data.earlybirdDiscountSnapshots?.map(
      (snapshot) => new EarlybirdDiscountSnapshotModel(snapshot),
    );
    this.combinationDiscountSnapshots = data.combinationDiscountSnapshots?.map(
      (snapshot) => new CombinationDiscountSnapshotModel(snapshot),
    );
    this.requiredAdditionalInfos = data.requiredAdditionalInfos?.map((info) => new RequiredAdditionalInfoModel(info));
    this.competitionHostMaps = data.competitionHostMaps?.map((map) => new CompetitionHostMapModel(map));
    this.competitionPosterImages = data.competitionPosterImages?.map(
      (posterImage) => new CompetitionPosterImageModel(posterImage),
    );
  }

  toData(): ICompetitionModelData {
    return {
      id: this.id,
      competitionPaymentId: this.competitionPaymentId,
      title: this.title,
      address: this.address,
      competitionDate: this.competitionDate,
      registrationStartDate: this.registrationStartDate,
      registrationEndDate: this.registrationEndDate,
      refundDeadlineDate: this.refundDeadlineDate,
      soloRegistrationAdjustmentStartDate: this.soloRegistrationAdjustmentStartDate,
      soloRegistrationAdjustmentEndDate: this.soloRegistrationAdjustmentEndDate,
      registrationListOpenDate: this.registrationListOpenDate,
      bracketOpenDate: this.bracketOpenDate,
      description: this.description,
      isPartnership: this.isPartnership,
      viewCount: this.viewCount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      divisions: this.divisions?.map((division) => division.toData()),
      earlybirdDiscountSnapshots: this.earlybirdDiscountSnapshots?.map((snapshot) => snapshot.toData()),
      combinationDiscountSnapshots: this.combinationDiscountSnapshots?.map((snapshot) => snapshot.toData()),
      requiredAdditionalInfos: this.requiredAdditionalInfos?.map((info) => info.toData()),
      competitionHostMaps: this.competitionHostMaps?.map((map) => map.toData()),
      competitionPosterImages: this.competitionPosterImages?.map((posterImage) => posterImage.toData()),
    };
  }

  getId() {
    return this.id;
  }

  getCompetitionPaymentId() {
    return this.competitionPaymentId;
  }

  getTitle() {
    return this.title;
  }

  getLatestEarlybirdDiscountSnapshot(): EarlybirdDiscountSnapshotModel | null {
    if (!this.earlybirdDiscountSnapshots)
      throw new Error('earlybirdDiscountSnapshots is not initialized in CompetitionModel');
    if (this.earlybirdDiscountSnapshots.length === 0) return null;
    return this.earlybirdDiscountSnapshots[this.earlybirdDiscountSnapshots.length - 1];
  }

  getLatestCombinationDiscountSnapshot(): CombinationDiscountSnapshotModel | null {
    if (!this.combinationDiscountSnapshots)
      throw new Error('combinationDiscountSnapshots is not initialized in CompetitionModel');
    if (this.combinationDiscountSnapshots.length === 0) return null;
    return this.combinationDiscountSnapshots[this.combinationDiscountSnapshots.length - 1];
  }

  update(updateDto: ICompetitionUpdateDto) {
    if (updateDto.title) this.title = updateDto.title;
    if (updateDto.address) this.address = updateDto.address;
    if (updateDto.competitionDate) this.competitionDate = updateDto.competitionDate;
    if (updateDto.registrationStartDate) this.registrationStartDate = updateDto.registrationStartDate;
    if (updateDto.registrationEndDate) this.registrationEndDate = updateDto.registrationEndDate;
    if (updateDto.refundDeadlineDate) this.refundDeadlineDate = updateDto.refundDeadlineDate;
    if (updateDto.soloRegistrationAdjustmentStartDate)
      this.soloRegistrationAdjustmentStartDate = updateDto.soloRegistrationAdjustmentStartDate;
    if (updateDto.soloRegistrationAdjustmentEndDate)
      this.soloRegistrationAdjustmentEndDate = updateDto.soloRegistrationAdjustmentEndDate;
    if (updateDto.registrationListOpenDate) this.registrationListOpenDate = updateDto.registrationListOpenDate;
    if (updateDto.bracketOpenDate) this.bracketOpenDate = updateDto.bracketOpenDate;
    if (updateDto.description) this.description = updateDto.description;
    if (updateDto.isPartnership) this.isPartnership = updateDto.isPartnership;
  }

  updateStatus(newStatus: ICompetitionModelData['status']) {
    if (newStatus === 'ACTIVE') {
      const missingProperties: string[] = [];
      if (this.title === 'DEFAULT TITLE') missingProperties.push('title');
      if (this.address === 'DEFAULT ADDRESS') missingProperties.push('address');
      if (this.competitionDate === null) missingProperties.push('competitionDate');
      if (this.registrationStartDate === null) missingProperties.push('registrationStartDate');
      if (this.registrationEndDate === null) missingProperties.push('registrationEndDate');
      if (this.refundDeadlineDate === null) missingProperties.push('refundDeadlineDate');
      if (this.description === 'DEFAULT DESCRIPTION') missingProperties.push('description');
      if (missingProperties.length > 0) {
        throw new BusinessException(
          CompetitionsErrors.COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE,
          `다음 항목을 작성해주세요: ${missingProperties.join(', ')}`,
        );
      }
    }
    this.status = newStatus;
  }

  addDivisions(newDivisions: DivisionModel[]) {
    if (!this.divisions) throw new Error('divisions is not initialized in CompetitionModel');
    const duplicatedDivisions = this.divisions.filter((division) => {
      return newDivisions.some(
        (newDivision) =>
          newDivision.getCategory() === division.getCategory() &&
          newDivision.getUniform() === division.getUniform() &&
          newDivision.getGender() === division.getGender() &&
          newDivision.getBelt() === division.getBelt() &&
          newDivision.getWeight() === division.getWeight(),
      );
    });
    if (duplicatedDivisions.length > 0) {
      throw new BusinessException(
        CompetitionsErrors.COMPETITIONS_DIVISION_DUPLICATED,
        `${duplicatedDivisions
          .map(
            (division) =>
              `${division.getCategory()} ${division.getUniform()} ${division.getGender()} ${division.getBelt()} ${division.getWeight()}`,
          )
          .join(', ')}`,
      );
    }
    this.divisions.push(...newDivisions);
  }

  addEarlybirdDiscountSnapshot(newEarlybirdDiscountSnapshot: EarlybirdDiscountSnapshotModel) {
    if (!this.earlybirdDiscountSnapshots)
      throw new Error('earlybirdDiscountSnapshots is not initialized in CompetitionModel');
    this.earlybirdDiscountSnapshots = [...this.earlybirdDiscountSnapshots, newEarlybirdDiscountSnapshot];
  }

  addCombinationDiscountSnapshot(newCombinationDiscountSnapshot: CombinationDiscountSnapshotModel) {
    if (!this.combinationDiscountSnapshots)
      throw new Error('combinationDiscountSnapshots is not initialized in CompetitionModel');
    this.combinationDiscountSnapshots = [...this.combinationDiscountSnapshots, newCombinationDiscountSnapshot];
  }

  updateRequiredAdditionalInfo(requiredAdditionalInfoUpdateDto: IRequiredAdditionalInfoUpdateDto) {
    if (!this.requiredAdditionalInfos)
      throw new Error('requiredAdditionalInfos is not initialized in CompetitionModel');
    const requiredAdditionalInfo = this.requiredAdditionalInfos.find(
      (info) => info.getId() === requiredAdditionalInfoUpdateDto.id,
    );
    if (!requiredAdditionalInfo)
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'RequiredAdditionalInfo not found');
    requiredAdditionalInfo.update(requiredAdditionalInfoUpdateDto);
  }

  deleteRequiredAdditionalInfo(requiredAdditionalInfoId: RequiredAdditionalInfoModel['id']) {
    if (!this.requiredAdditionalInfos)
      throw new Error('requiredAdditionalInfos is not initialized in CompetitionModel');
    const requiredAdditionalInfo = this.requiredAdditionalInfos.find(
      (info) => info.getId() === requiredAdditionalInfoId,
    );
    if (!requiredAdditionalInfo)
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'RequiredAdditionalInfo not found');
    requiredAdditionalInfo.delete();
  }

  validateApplicationPeriod(now = new Date()) {
    if (this.registrationStartDate && now < this.registrationStartDate)
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REGISTRATION_NOT_STARTED,
        `registrationStartDate: ${this.registrationStartDate}`,
      );
    if (this.registrationEndDate && now > this.registrationEndDate)
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REGISTRATION_ENDED,
        `registrationEndDate: ${this.registrationEndDate}`,
      );
  }

  calculateExpectedPayment(participationDivisionIds: IDivision['id'][]) {
    if (!this.divisions) throw new Error('divisions is not initialized in CompetitionModel');
    const divisions = this.divisions.filter((division) => participationDivisionIds.includes(division.getId()));
    const priceSnapshots = divisions.map((division) => division.getLatestPriceSnapshot());
    const earlybirdDiscountSnapshot = this.getLatestEarlybirdDiscountSnapshot();
    const combinationDiscountSnapshot = this.getLatestCombinationDiscountSnapshot();
    return CalculatePaymentService.calculate(
      divisions,
      priceSnapshots,
      earlybirdDiscountSnapshot,
      combinationDiscountSnapshot,
    );
  }

  addRequiredAdditionalInfo(newRequiredAdditionalInfo: RequiredAdditionalInfoModel) {
    if (!this.requiredAdditionalInfos)
      throw new Error('requiredAdditionalInfos is not initialized in CompetitionModel');
    this.requiredAdditionalInfos.forEach((info) => {
      if (info.getType() === newRequiredAdditionalInfo.getType()) {
        throw new BusinessException(
          CompetitionsErrors.COMPETITIONS_REQUIRED_ADDITIONAL_INFO_DUPLICATED,
          `type: ${newRequiredAdditionalInfo.getType()}`,
        );
      }
    });
    this.requiredAdditionalInfos.push(newRequiredAdditionalInfo);
  }

  validateAdditionalInfo(additionalInfoCreateDtos?: IAdditionalInfoCreateDto[]) {
    if (!this.requiredAdditionalInfos)
      throw new Error('requiredAdditionalInfos is not initialized in CompetitionModel');
    const requiredAdditionalInfoTypes = this.requiredAdditionalInfos.map((info) => info.getType());
    const additionalInfoTypes = additionalInfoCreateDtos?.map((info) => info.type) || [];
    const missingTypes = requiredAdditionalInfoTypes.filter((type) => !additionalInfoTypes.includes(type));
    if (missingTypes.length > 0) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH,
        `type: ${missingTypes.join(', ')}`,
      );
    }
  }

  getDivision(divisionId: IDivision['id']): DivisionModel {
    if (!this.divisions) throw new Error('divisions is not initialized in CompetitionModel');
    const division = this.divisions.find((division) => division.getId() === divisionId);
    if (!division) {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, `Not found DivisionId: ${divisionId}`);
    }
    return division;
  }

  getManyDivisions(divisionIds: IDivision['id'][]): DivisionModel[] {
    if (!this.divisions) throw new Error('divisions is not initialized in CompetitionModel');
    const divisions = this.divisions.filter((division) => divisionIds.includes(division.getId()));
    if (divisions.length === 0) {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, `Not found DivisionIds: ${divisionIds.join(', ')}`);
    }
    return divisions;
  }

  updatePosterImage(newPosterImage: CompetitionPosterImageModel) {
    if (!this.competitionPosterImages)
      throw new Error('competitionPosterImages is not initialized in CompetitionModel');
    this.competitionPosterImages.forEach((posterImage) => {
      posterImage.delete();
    });
    this.competitionPosterImages = [...this.competitionPosterImages, newPosterImage];
  }

  deletePosterImage() {
    if (!this.competitionPosterImages)
      throw new Error('competitionPosterImages is not initialized in CompetitionModel');
    this.competitionPosterImages.forEach((image) => {
      image.delete();
    });
  }
}
