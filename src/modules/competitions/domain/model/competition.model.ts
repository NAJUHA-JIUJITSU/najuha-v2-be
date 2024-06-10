import {
  ApplicationsErrors,
  BusinessException,
  CommonErrors,
  CompetitionsErrors,
} from 'src/common/response/errorResponse';
import { ICompetition, ICompetitionUpdateDto } from '../interface/competition.interface';
import { CombinationDiscountSnapshotModel } from './combination-discount-snapshot.model';
import { DivisionModel } from './division.model';
import { EarlybirdDiscountSnapshotModel } from './earlybird-discount-snapshot.entity';
import { IDivision } from '../interface/division.interface';
import { IPriceSnapshot } from '../interface/price-snapshot.interface';
import { RequiredAdditionalInfoModel } from './required-addtional-info.model';
import { IAdditionalInfoCreateDto } from 'src/modules/applications/domain/interface/additional-info.interface';
import { IRequiredAdditionalInfoUpdateDto } from '../interface/required-addtional-info.interface';
import { ICompetitionHostMap } from '../interface/competition-host-map.interface';
import { CalculatePaymentService } from '../calculate-payment.domain.service';
import { ICompetitionPosterImage } from '../interface/competition-poster-image.interface';

export class CompetitionModel {
  private readonly id: ICompetition['id'];
  private title: ICompetition['title'];
  private address: ICompetition['address'];
  private competitionDate: ICompetition['competitionDate'];
  private registrationStartDate: ICompetition['registrationStartDate'];
  private registrationEndDate: ICompetition['registrationEndDate'];
  private refundDeadlineDate: ICompetition['refundDeadlineDate'];
  private soloRegistrationAdjustmentStartDate: ICompetition['soloRegistrationAdjustmentStartDate'];
  private soloRegistrationAdjustmentEndDate: ICompetition['soloRegistrationAdjustmentEndDate'];
  private registrationListOpenDate: ICompetition['registrationListOpenDate'];
  private bracketOpenDate: ICompetition['bracketOpenDate'];
  private description: ICompetition['description'];
  private isPartnership: ICompetition['isPartnership'];
  private viewCount: ICompetition['viewCount'];
  private posterImgUrlKey: ICompetition['posterImgUrlKey'];
  private status: ICompetition['status'];
  private divisions: DivisionModel[];
  private requiredAdditionalInfos: RequiredAdditionalInfoModel[];
  private earlybirdDiscountSnapshots: EarlybirdDiscountSnapshotModel[];
  private combinationDiscountSnapshots: CombinationDiscountSnapshotModel[];
  private competitionHostMaps: ICompetitionHostMap[];
  private competitionPosterImages: ICompetitionPosterImage[];
  private readonly createdAt: ICompetition['createdAt'];
  private readonly updatedAt: ICompetition['updatedAt'];

  constructor(entity: ICompetition) {
    this.id = entity.id;
    this.title = entity.title;
    this.address = entity.address;
    this.competitionDate = entity.competitionDate;
    this.registrationStartDate = entity.registrationStartDate;
    this.registrationEndDate = entity.registrationEndDate;
    this.refundDeadlineDate = entity.refundDeadlineDate;
    this.soloRegistrationAdjustmentStartDate = entity.soloRegistrationAdjustmentStartDate;
    this.soloRegistrationAdjustmentEndDate = entity.soloRegistrationAdjustmentEndDate;
    this.registrationListOpenDate = entity.registrationListOpenDate;
    this.bracketOpenDate = entity.bracketOpenDate;
    this.description = entity.description;
    this.isPartnership = entity.isPartnership;
    this.viewCount = entity.viewCount;
    this.posterImgUrlKey = entity.posterImgUrlKey;
    this.status = entity.status;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.divisions = entity.divisions.map((division) => new DivisionModel(division));
    this.earlybirdDiscountSnapshots = entity.earlybirdDiscountSnapshots.map(
      (snapshot) => new EarlybirdDiscountSnapshotModel(snapshot),
    );
    this.combinationDiscountSnapshots = entity.combinationDiscountSnapshots.map(
      (snapshot) => new CombinationDiscountSnapshotModel(snapshot),
    );
    this.requiredAdditionalInfos = entity.requiredAdditionalInfos.map((info) => new RequiredAdditionalInfoModel(info));
    this.competitionHostMaps = entity.competitionHostMaps;
    this.competitionPosterImages = entity.competitionPosterImages;
  }

  toEntity(): ICompetition {
    return {
      id: this.id,
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
      posterImgUrlKey: this.posterImgUrlKey,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      divisions: this.divisions.map((division) => division.toEntity()),
      earlybirdDiscountSnapshots: this.earlybirdDiscountSnapshots.map((snapshot) => snapshot.toEntity()),
      combinationDiscountSnapshots: this.combinationDiscountSnapshots.map((snapshot) => snapshot.toEntity()),
      requiredAdditionalInfos: this.requiredAdditionalInfos,
      competitionHostMaps: this.competitionHostMaps,
      competitionPosterImages: this.competitionPosterImages,
    };
  }

  getId() {
    return this.id;
  }

  getLatestEarlybirdDiscountSnapshot(): EarlybirdDiscountSnapshotModel | null {
    if (this.earlybirdDiscountSnapshots.length === 0) return null;
    return this.earlybirdDiscountSnapshots[this.earlybirdDiscountSnapshots.length - 1];
  }

  getLatestCombinationDiscountSnapshot(): CombinationDiscountSnapshotModel | null {
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

  updateStatus(newStatus: ICompetition['status']) {
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
    const duplicatedDivisions = this.divisions.filter((division) => {
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
    this.divisions.push(...newDivisions);
  }

  addEarlybirdDiscountSnapshot(newEarlybirdDiscountSnapshot: EarlybirdDiscountSnapshotModel) {
    this.earlybirdDiscountSnapshots.push(newEarlybirdDiscountSnapshot);
  }

  addCombinationDiscountSnapshot(newCombinationDiscountSnapshot: CombinationDiscountSnapshotModel) {
    this.combinationDiscountSnapshots.push(newCombinationDiscountSnapshot);
  }

  updateRequiredAdditionalInfo(requiredAdditionalInfoUpdateDto: IRequiredAdditionalInfoUpdateDto) {
    const requiredAdditionalInfo = this.requiredAdditionalInfos.find(
      (info) => info.id === requiredAdditionalInfoUpdateDto.id,
    );
    if (!requiredAdditionalInfo)
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, 'RequiredAdditionalInfo not found');
    requiredAdditionalInfo.update(requiredAdditionalInfoUpdateDto);
  }

  deleteRequiredAdditionalInfo(requiredAdditionalInfoId: RequiredAdditionalInfoModel['id']) {
    const requiredAdditionalInfo = this.requiredAdditionalInfos.find((info) => info.id === requiredAdditionalInfoId);
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
    const divisions = this.divisions.filter((division) => participationDivisionIds.includes(division.id));
    const priceSnapshots = divisions.reduce<IPriceSnapshot[]>((acc, division) => {
      acc.push(division.getLatestPriceSnapshot());
      return acc;
    }, []);
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
    this.requiredAdditionalInfos.forEach((info) => {
      if (info.type === newRequiredAdditionalInfo.type) {
        throw new BusinessException(
          CompetitionsErrors.COMPETITIONS_REQUIRED_ADDITIONAL_INFO_DUPLICATED,
          `type: ${newRequiredAdditionalInfo.type}`,
        );
      }
    });
    this.requiredAdditionalInfos.push(newRequiredAdditionalInfo);
  }

  validateAdditionalInfo(additionalInfoCreateDtos?: IAdditionalInfoCreateDto[]) {
    const requiredAdditionalInfoTypes = this.requiredAdditionalInfos.map((info) => info.type);
    const additionalInfoTypes = additionalInfoCreateDtos?.map((info) => info.type) ?? [];
    const missingTypes = requiredAdditionalInfoTypes.filter((type) => !additionalInfoTypes.includes(type));
    if (missingTypes.length > 0) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REQUIRED_ADDITIONAL_INFO_NOT_MATCH,
        `type: ${missingTypes.join(', ')}`,
      );
    }
  }

  getDivision(divisionId: IDivision['id']): DivisionModel {
    const division = this.divisions.find((division) => division.id === divisionId);
    if (!division) {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, `Not found DivisionId: ${divisionId}`);
    }
    return division;
  }

  getManyDivisions(divisionIds: IDivision['id'][]): DivisionModel[] {
    const divisions = this.divisions.filter((division) => divisionIds.includes(division.id));
    if (divisions.length === 0) {
      throw new BusinessException(CommonErrors.ENTITY_NOT_FOUND, `Not found DivisionIds: ${divisionIds.join(', ')}`);
    }
    return divisions;
  }

  updatePosterImage(newPosterImage: ICompetitionPosterImage) {
    this.competitionPosterImages.forEach((image) => {
      image.deletedAt = new Date();
    });
    this.competitionPosterImages.push(newPosterImage);
  }
}
