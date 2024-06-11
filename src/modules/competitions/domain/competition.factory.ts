import { Injectable } from '@nestjs/common';
import { ICompetition, ICompetitionCreateDto } from './interface/competition.interface';
import { uuidv7 } from 'uuidv7';
import {
  IEarlybirdDiscountSnapshot,
  IEarlybirdDiscountSnapshotCreateDto,
} from './interface/earlybird-discount-snapshot.interface';
import {
  ICombinationDiscountSnapshot,
  ICombinationDiscountSnapshotCreateDto,
} from './interface/combination-discount-snapshot.interface';
import {
  IRequiredAdditionalInfo,
  IRequiredAdditionalInfoCreateDto,
} from './interface/required-addtional-info.interface';
import {
  ICompetitionPosterImage,
  ICompetitionPosterImageCreateDto,
} from './interface/competition-poster-image.interface';
import { IImage } from 'src/modules/images/domain/interface/image.interface';

@Injectable()
export class CompetitionFactory {
  createCompetition(createCompetitionDto: ICompetitionCreateDto): ICompetition {
    return {
      id: uuidv7(),
      title: createCompetitionDto.title ?? 'DEFAULT TITLE',
      address: createCompetitionDto.address ?? 'DEFAULT ADDRESS',
      competitionDate: createCompetitionDto.competitionDate ?? null,
      registrationStartDate: createCompetitionDto.registrationStartDate ?? null,
      registrationEndDate: createCompetitionDto.registrationEndDate ?? null,
      refundDeadlineDate: createCompetitionDto.refundDeadlineDate ?? null,
      soloRegistrationAdjustmentStartDate: createCompetitionDto.soloRegistrationAdjustmentStartDate ?? null,
      soloRegistrationAdjustmentEndDate: createCompetitionDto.soloRegistrationAdjustmentEndDate ?? null,
      registrationListOpenDate: createCompetitionDto.registrationListOpenDate ?? null,
      bracketOpenDate: createCompetitionDto.bracketOpenDate ?? null,
      description: createCompetitionDto.description ?? 'DEFAULT DESCRIPTION',
      isPartnership: createCompetitionDto.isPartnership ?? false,
      viewCount: 0,
      status: 'INACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      divisions: [],
      earlybirdDiscountSnapshots: [],
      combinationDiscountSnapshots: [],
      requiredAdditionalInfos: [],
      competitionHostMaps: [],
      competitionPosterImages: [],
    };
  }

  createEarlybirdDiscountSnapshot(
    earlybirdDiscountSnapshotCreateDto: IEarlybirdDiscountSnapshotCreateDto,
  ): IEarlybirdDiscountSnapshot {
    return {
      id: uuidv7(),
      earlybirdStartDate: earlybirdDiscountSnapshotCreateDto.earlybirdStartDate,
      earlybirdEndDate: earlybirdDiscountSnapshotCreateDto.earlybirdEndDate,
      discountAmount: earlybirdDiscountSnapshotCreateDto.discountAmount,
      competitionId: earlybirdDiscountSnapshotCreateDto.competitionId,
      createdAt: new Date(),
    };
  }

  createCombinationDiscountSnapshot(
    combinationDiscountSnapshotCreateDto: ICombinationDiscountSnapshotCreateDto,
  ): ICombinationDiscountSnapshot {
    return {
      id: uuidv7(),
      combinationDiscountRules: combinationDiscountSnapshotCreateDto.combinationDiscountRules,
      competitionId: combinationDiscountSnapshotCreateDto.competitionId,
      createdAt: new Date(),
    };
  }

  createCompetitionRequiredAdditionalInfo(
    requiredAdditionalInfoCreateDto: IRequiredAdditionalInfoCreateDto,
  ): IRequiredAdditionalInfo {
    return {
      id: uuidv7(),
      type: requiredAdditionalInfoCreateDto.type,
      description: requiredAdditionalInfoCreateDto.description,
      competitionId: requiredAdditionalInfoCreateDto.competitionId,
      createdAt: new Date(),
      deletedAt: null,
    };
  }

  createCompetitionPosterImage(
    image: IImage,
    competitionPosterImageCreateDto: ICompetitionPosterImageCreateDto,
  ): ICompetitionPosterImage {
    return {
      id: uuidv7(),
      competitionId: competitionPosterImageCreateDto.competitionId,
      imageId: competitionPosterImageCreateDto.imageId,
      createdAt: new Date(),
      deletedAt: null,
      image: {
        ...image,
        linkedAt: new Date(),
      },
    };
  }
}
