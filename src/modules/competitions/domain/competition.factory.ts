import { Injectable } from '@nestjs/common';
import { ICompetitionCreateDto, ICompetitionModelData } from './interface/competition.interface';
import { uuidv7 } from 'uuidv7';
import {
  IEarlybirdDiscountSnapshotCreateDto,
  IEarlybirdDiscountSnapshotModelData,
} from './interface/earlybird-discount-snapshot.interface';
import {
  ICombinationDiscountSnapshotCreateDto,
  ICombinationDiscountSnapshotModelData,
} from './interface/combination-discount-snapshot.interface';
import {
  IRequiredAdditionalInfoCreateDto,
  IRequiredAdditionalInfoModelData,
} from './interface/required-additional-info.interface';
import {
  ICompetitionPosterImageCreateDto,
  ICompetitionPosterImageModelData,
} from './interface/competition-poster-image.interface';
import { IImage } from '../../images/domain/interface/image.interface';
import { ulid } from 'ulid';

@Injectable()
export class CompetitionFactory {
  createCompetition(createCompetitionDto: ICompetitionCreateDto): ICompetitionModelData {
    return {
      id: uuidv7(),
      competitionPaymentId: ulid(),
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
  ): IEarlybirdDiscountSnapshotModelData {
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
  ): ICombinationDiscountSnapshotModelData {
    return {
      id: uuidv7(),
      combinationDiscountRules: combinationDiscountSnapshotCreateDto.combinationDiscountRules,
      competitionId: combinationDiscountSnapshotCreateDto.competitionId,
      createdAt: new Date(),
    };
  }

  createCompetitionRequiredAdditionalInfo(
    requiredAdditionalInfoCreateDto: IRequiredAdditionalInfoCreateDto,
  ): IRequiredAdditionalInfoModelData {
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
    competitionPosterImageCreateDto: ICompetitionPosterImageCreateDto,
    image: IImage,
  ): ICompetitionPosterImageModelData {
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

  createRequiredAdditionalInfo(
    requiredAdditionalInfoCreateDto: IRequiredAdditionalInfoCreateDto,
  ): IRequiredAdditionalInfoModelData {
    return {
      id: uuidv7(),
      type: requiredAdditionalInfoCreateDto.type,
      description: requiredAdditionalInfoCreateDto.description,
      competitionId: requiredAdditionalInfoCreateDto.competitionId,
      createdAt: new Date(),
      deletedAt: null,
    };
  }
}
