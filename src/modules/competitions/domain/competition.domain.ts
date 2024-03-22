// import { BusinessException, CompetitionsErrorMap } from 'src/common/response/errorResponse';
// import { CompetitionEntity } from '../structure/competition.interface';

// export class CompetitionEntity {
//   public id: CompetitionEntity['id'];
//   public title: CompetitionEntity['title'];
//   public address: CompetitionEntity['address'];
//   public competitionDate: CompetitionEntity['competitionDate'];
//   public registrationStartDate: CompetitionEntity['registrationStartDate'];
//   public registrationEndDate: CompetitionEntity['registrationEndDate'];
//   public refundDeadlineDate: CompetitionEntity['refundDeadlineDate'];
//   public soloRegistrationAdjustmentStartDate: CompetitionEntity['soloRegistrationAdjustmentStartDate'];
//   public soloRegistrationAdjustmentEndDate: CompetitionEntity['soloRegistrationAdjustmentEndDate'];
//   public registrationListOpenDate: CompetitionEntity['registrationListOpenDate'];
//   public bracketOpenDate: CompetitionEntity['bracketOpenDate'];
//   public description: CompetitionEntity['description'];
//   public isPartnership: CompetitionEntity['isPartnership'];
//   public viewCount: CompetitionEntity['viewCount'];
//   public posterImgUrlKey: CompetitionEntity['posterImgUrlKey'];
//   public status: CompetitionEntity['status'];
//   public createdAt: CompetitionEntity['createdAt'];
//   public updatedAt: CompetitionEntity['updatedAt'];
//   public earlybirdDiscountSnapshots?: CompetitionEntity['earlybirdDiscountSnapshots'];
//   public divisions?: CompetitionEntity['divisions'];
//   public applicationPackages?: CompetitionEntity['applicationPackages'];

//   constructor(params: CompetitionEntity) {
//     Object.assign(this, params);
//   }

//   updateStatus(status: CompetitionEntity['status']): void {
//     if (status === 'ACTIVE') {
//       const missingProperties: string[] = [];
//       if (this.title === 'DEFAULT TITLE') missingProperties.push('title');
//       if (this.address === 'DEFAULT ADDRESS') missingProperties.push('address');
//       if (this.competitionDate === null) missingProperties.push('competitionDate');
//       if (this.registrationStartDate === null) missingProperties.push('registrationStartDate');
//       if (this.registrationEndDate === null) missingProperties.push('registrationEndDate');
//       if (this.description === 'DEFAULT DESCRIPTION') missingProperties.push('description');

//       if (missingProperties.length > 0) {
//         throw new BusinessException(
//           CompetitionsErrorMap.COMPETITIONS_COMPETITION_STATUS_CANNOT_BE_ACTIVE,
//           `다음 항목을 작성해주세요: ${missingProperties.join(', ')}`,
//         );
//       }
//     }
//     this.status = status;
//   }
// }
