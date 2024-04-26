import { ApplicationsErrors, BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { ICompetition } from '../interface/competition.interface';
import { CombinationDiscountSnapshotModel } from './combination-discount-snapshot.model';
import { DivisionModel } from './division.model';
import { EarlybirdDiscountSnapshotModel } from './earlybird-discount-snapshot.entity';
import { IDivision } from '../interface/division.interface';

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
  private readonly earlybirdDiscountSnapshots: EarlybirdDiscountSnapshotModel[];
  private readonly combinationDiscountSnapshots: CombinationDiscountSnapshotModel[];

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

  // validateApplicationAbility(
  //   playerSnapshotCreateDto: IPlayerSnapshotCreateDto,
  //   participationDivisionIds: IDivision['id'][],
  //   now = new Date(),
  // ) {
  //   this.validateApplicationPeriod(now);
  //   this.validateDivisionSuitable(playerSnapshotCreateDto, participationDivisionIds);
  // }

  // private validateDivisionSuitable(
  //   playerSnapshotCreateDto: IPlayerSnapshotCreateDto,
  //   participationDivisionIds: IDivision['id'][],
  // ) {
  //   participationDivisionIds.forEach((divisionId) => {
  //     const division = this.divisions.find((division) => division.id === divisionId);
  //     if (!division)
  //       throw new BusinessException(
  //         ApplicationsErrors.APPLICATIONS_DIVISION_NOT_FOUND,
  //         `Missing DivisionId: ${divisionId}`,
  //       );
  //     // TODO: Implement validateAge, validateGender
  //     // division.validateAge(playerSnapshotCreateDto.birth);
  //     // division.validateGender(playerSnapshotCreateDto.gender);
  //   });
  // }

  // private validateExistDivisions(particiationDivisionIds: IDivision['id'][]): IDivision[] {
  //   const existDivisions: IDivision[] = [];
  //   this.divisions.forEach((division) => {
  //     if (particiationDivisionIds.includes(division.id)) {
  //       existDivisions.push(division);
  //     }
  //   });
  //   if (existDivisions.length !== particiationDivisionIds.length) {
  //     throw new BusinessException(
  //       ApplicationsErrors.APPLICATIONS_DIVISION_NOT_FOUND,
  //       `divisionIds: ${particiationDivisionIds.join(', ')}`,
  //     );
  //   }
  //   return existDivisions;
  // }

  // private validateDivisionAge(playerBirth: IPlayerSnapshotCreateDto['birth'], division: IDivision): void {
  //   const birthYear = +playerBirth.slice(0, 4);
  //   if (birthYear < +division.birthYearRangeStart || birthYear > +division.birthYearRangeEnd) {
  //     throw new BusinessException(
  //       ApplicationsErrors.APPLICATIONS_DIVISION_AGE_NOT_MATCH,
  //       `divisionId: ${division.id}, divisionBirthRangeStart: ${division.birthYearRangeStart}, divisionBirthRangeEnd: ${division.birthYearRangeEnd}, playerBirth: ${playerBirth}`,
  //     );
  //   }
  // }

  // private validateDivisionGender(playerGender: IPlayerSnapshotCreateDto['gender'], division: IDivision): void {
  //   if (division.gender === 'MIXED') return;
  //   if (playerGender !== division.gender) {
  //     throw new BusinessException(
  //       ApplicationsErrors.APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
  //       `divisionId: ${division.id}, divisionGender: ${division.gender}, playerGender: ${playerGender}`,
  //     );
  //   }
  // }
}
