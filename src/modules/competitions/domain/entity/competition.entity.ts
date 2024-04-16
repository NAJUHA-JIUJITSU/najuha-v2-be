import { ApplicationsErrorMap, BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
import { ICompetition } from '../interface/competition.interface';
import { CombinationDiscountSnapshotEntity } from './combination-discount-snapshot.entity';
import { DivisionEntity } from './division.entity';
import { EarlybirdDiscountSnapshotEntity } from './earlybird-discount-snapshot.entity';
import { IDivision } from '../interface/division.interface';
import { IPlayerSnapshot } from 'src/modules/applications/domain/interface/player-snapshot.interface';

export class CompetitionEntity {
  public id: ICompetition['id'];
  public title: ICompetition['title'];
  public address: ICompetition['address'];
  public competitionDate: ICompetition['competitionDate'];
  public registrationStartDate: ICompetition['registrationStartDate'];
  public registrationEndDate: ICompetition['registrationEndDate'];
  public refundDeadlineDate: ICompetition['refundDeadlineDate'];
  public soloRegistrationAdjustmentStartDate: ICompetition['soloRegistrationAdjustmentStartDate'];
  public soloRegistrationAdjustmentEndDate: ICompetition['soloRegistrationAdjustmentEndDate'];
  public registrationListOpenDate: ICompetition['registrationListOpenDate'];
  public bracketOpenDate: ICompetition['bracketOpenDate'];
  public description: ICompetition['description'];
  public isPartnership: ICompetition['isPartnership'];
  public viewCount: ICompetition['viewCount'];
  public posterImgUrlKey: ICompetition['posterImgUrlKey'];
  public status: ICompetition['status'];
  public createdAt: ICompetition['createdAt'];
  public updatedAt: ICompetition['updatedAt'];
  public divisions: DivisionEntity[];
  public earlybirdDiscountSnapshots: EarlybirdDiscountSnapshotEntity[];
  public combinationDiscountSnapshots: CombinationDiscountSnapshotEntity[];

  constructor(competition: ICompetition) {
    this.id = competition.id;
    this.title = competition.title;
    this.address = competition.address;
    this.competitionDate = competition.competitionDate;
    this.registrationStartDate = competition.registrationStartDate;
    this.registrationEndDate = competition.registrationEndDate;
    this.refundDeadlineDate = competition.refundDeadlineDate;
    this.soloRegistrationAdjustmentStartDate = competition.soloRegistrationAdjustmentStartDate;
    this.soloRegistrationAdjustmentEndDate = competition.soloRegistrationAdjustmentEndDate;
    this.registrationListOpenDate = competition.registrationListOpenDate;
    this.bracketOpenDate = competition.bracketOpenDate;
    this.description = competition.description;
    this.isPartnership = competition.isPartnership;
    this.viewCount = competition.viewCount;
    this.posterImgUrlKey = competition.posterImgUrlKey;
    this.status = competition.status;
    this.createdAt = competition.createdAt;
    this.updatedAt = competition.updatedAt;
    this.divisions = competition.divisions.map((division) => new DivisionEntity(division));
    this.earlybirdDiscountSnapshots = competition.earlybirdDiscountSnapshots.map(
      (snapshot) => new EarlybirdDiscountSnapshotEntity(snapshot),
    );
    this.combinationDiscountSnapshots = competition.combinationDiscountSnapshots.map(
      (snapshot) => new CombinationDiscountSnapshotEntity(snapshot),
    );
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

  addDivisions(newDivisions: IDivision[]) {
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
    this.divisions = [...this.divisions, ...newDivisions];
  }

  validateApplicationAbility(
    createPlayerSnapshotDto: IPlayerSnapshot.CreateDto,
    participationDivisionIds: IDivision['id'][],
    now = new Date(),
  ) {
    this.validateApplicationPeriod(now);
    this.validateDivisionSuitable(createPlayerSnapshotDto, participationDivisionIds);
  }

  private validateApplicationPeriod(now = new Date()) {
    if (this.registrationStartDate && now < this.registrationStartDate) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_REGISTRATION_NOT_STARTED,
        `registrationStartDate: ${this.registrationStartDate}`,
      );
    }
    if (this.registrationEndDate && now > this.registrationEndDate) {
      throw new BusinessException(
        ApplicationsErrorMap.APPLICATIONS_REGISTRATION_ENDED,
        `registrationEndDate: ${this.registrationEndDate}`,
      );
    }
  }

  private validateDivisionSuitable(
    createPlayerSnapshotDto: IPlayerSnapshot.CreateDto,
    participationDivisionIds: IDivision['id'][],
  ) {
    participationDivisionIds.forEach((divisionId) => {
      const division = this.divisions.find((division) => division.id === divisionId);
      if (!division)
        throw new BusinessException(
          ApplicationsErrorMap.APPLICATIONS_DIVISION_NOT_FOUND,
          `Missing DivisionId: ${divisionId}`,
        );
      // TODO: Implement validateAge, validateGender
      // division.validateAge(createPlayerSnapshotDto.birth);
      // division.validateGender(createPlayerSnapshotDto.gender);
    });
  }

  // private validateExistDivisions(particiationDivisionIds: IDivision['id'][]): IDivision[] {
  //   const existDivisions: IDivision[] = [];
  //   this.divisions.forEach((division) => {
  //     if (particiationDivisionIds.includes(division.id)) {
  //       existDivisions.push(division);
  //     }
  //   });
  //   if (existDivisions.length !== particiationDivisionIds.length) {
  //     throw new BusinessException(
  //       ApplicationsErrorMap.APPLICATIONS_DIVISION_NOT_FOUND,
  //       `divisionIds: ${particiationDivisionIds.join(', ')}`,
  //     );
  //   }
  //   return existDivisions;
  // }

  // private validateDivisionAge(playerBirth: IPlayerSnapshot.CreateDto['birth'], division: IDivision): void {
  //   const birthYear = +playerBirth.slice(0, 4);
  //   if (birthYear < +division.birthYearRangeStart || birthYear > +division.birthYearRangeEnd) {
  //     throw new BusinessException(
  //       ApplicationsErrorMap.APPLICATIONS_DIVISION_AGE_NOT_MATCH,
  //       `divisionId: ${division.id}, divisionBirthRangeStart: ${division.birthYearRangeStart}, divisionBirthRangeEnd: ${division.birthYearRangeEnd}, playerBirth: ${playerBirth}`,
  //     );
  //   }
  // }

  // private validateDivisionGender(playerGender: IPlayerSnapshot.CreateDto['gender'], division: IDivision): void {
  //   if (division.gender === 'MIXED') return;
  //   if (playerGender !== division.gender) {
  //     throw new BusinessException(
  //       ApplicationsErrorMap.APPLICATIONS_DIVISION_GENDER_NOT_MATCH,
  //       `divisionId: ${division.id}, divisionGender: ${division.gender}, playerGender: ${playerGender}`,
  //     );
  //   }
  // }
}
