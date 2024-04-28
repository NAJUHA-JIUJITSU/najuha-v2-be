import { ApplicationsErrors, BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { ICompetition } from '../interface/competition.interface';
import { CombinationDiscountSnapshotModel } from './combination-discount-snapshot.model';
import { DivisionModel } from './division.model';
import { EarlybirdDiscountSnapshotModel } from './earlybird-discount-snapshot.entity';
import { IDivision } from '../interface/division.interface';
import { CalculatePaymentService } from 'src/modules/applications/domain/calculate-payment.service';
import { IPriceSnapshot } from '../interface/price-snapshot.interface';
import { RequiredAddtionalInfoModel } from './required-addtional-info.model';

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
  private readonly createdAt: ICompetition['createdAt'];
  private readonly updatedAt: ICompetition['updatedAt'];
  private readonly divisions: DivisionModel[];
  private earlybirdDiscountSnapshots: EarlybirdDiscountSnapshotModel[];
  private combinationDiscountSnapshots: CombinationDiscountSnapshotModel[];
  private requiredAddtionalInfos: RequiredAddtionalInfoModel[];

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
    this.divisions = entity.divisions?.map((division) => new DivisionModel(division)) || [];
    this.earlybirdDiscountSnapshots =
      entity.earlybirdDiscountSnapshots?.map((snapshot) => new EarlybirdDiscountSnapshotModel(snapshot)) || [];
    this.combinationDiscountSnapshots =
      entity.combinationDiscountSnapshots?.map((snapshot) => new CombinationDiscountSnapshotModel(snapshot)) || [];
    this.requiredAddtionalInfos =
      entity.requiredAddtionalInfos?.map((info) => new RequiredAddtionalInfoModel(info)) || [];
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
      requiredAddtionalInfos: this.requiredAddtionalInfos,
    };
  }

  getId() {
    return this.id;
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
          CompetitionsErrorMap.COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE,
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
        CompetitionsErrorMap.COMPETITIONS_DIVISION_DUPLICATED,
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

  validateApplicationPeriod(now = new Date()) {
    if (this.registrationStartDate && now < this.registrationStartDate) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REGISTRATION_NOT_STARTED,
        `registrationStartDate: ${this.registrationStartDate}`,
      );
    }
    if (this.registrationEndDate && now > this.registrationEndDate) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_REGISTRATION_ENDED,
        `registrationEndDate: ${this.registrationEndDate}`,
      );
    }
  }

  validateParticipationAbleDivisions(participationDivisionIds: IDivision['id'][]) {
    const divisions = this.divisions.filter((division) => participationDivisionIds.includes(division.id));
    const notFoundDivisionIds = participationDivisionIds.filter(
      (divisionId) => !divisions.some((division) => division.id === divisionId),
    );
    if (notFoundDivisionIds.length > 0) {
      throw new BusinessException(
        ApplicationsErrors.APPLICATIONS_DIVISION_NOT_FOUND,
        `Not found DivisionIds: ${notFoundDivisionIds.join(', ')}`,
      );
    }
    return divisions;
  }

  calculateExpectedPayment(participationDivisionIds: IDivision['id'][]) {
    const divisions = this.divisions.filter((division) => participationDivisionIds.includes(division.id));
    const priceSnapshots = divisions.reduce<IPriceSnapshot[]>((acc, division) => {
      acc.push(division.priceSnapshots[division.priceSnapshots.length - 1]);
      return acc;
    }, []);
    const earlybirdDiscountSnapshot = this.earlybirdDiscountSnapshots[this.earlybirdDiscountSnapshots.length - 1];
    const combinationDiscountSnapshot = this.combinationDiscountSnapshots[this.combinationDiscountSnapshots.length - 1];
    return CalculatePaymentService.calculate(
      divisions,
      priceSnapshots,
      earlybirdDiscountSnapshot,
      combinationDiscountSnapshot,
    );
  }

  addRequiredAddtionalInfo(newRequiredAddtionalInfo: RequiredAddtionalInfoModel) {
    this.requiredAddtionalInfos.forEach((info) => {
      if (info.type === newRequiredAddtionalInfo.type) {
        throw new BusinessException(
          CompetitionsErrorMap.COMPETITIONS_REQUIRED_ADDITIONAL_INFO_DUPLICATED,
          `type: ${newRequiredAddtionalInfo.type}`,
        );
      }
    });
    this.requiredAddtionalInfos.push(newRequiredAddtionalInfo);
  }
}
