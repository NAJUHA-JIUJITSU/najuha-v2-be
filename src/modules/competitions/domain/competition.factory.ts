import { Injectable } from '@nestjs/common';
import { ICompetitionCreateDto } from './interface/competition.interface';
import { ulid } from 'ulid';
import { CompetitionModel } from './model/competition.model';
import { IEarlybirdDiscountSnapshotCreateDto } from './interface/earlybird-discount-snapshot.interface';
import { EarlybirdDiscountSnapshotModel } from './model/earlybird-discount-snapshot.entity';
import { ICombinationDiscountSnapshotCreateDto } from './interface/combination-discount-snapshot.interface';
import { CombinationDiscountSnapshotModel } from './model/combination-discount-snapshot.model';

@Injectable()
export class CompetitionFactory {
  createCompetition(createCompetitionDto: ICompetitionCreateDto): CompetitionModel {
    return new CompetitionModel({
      id: ulid(),
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
      posterImgUrlKey: null,
      status: 'INACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
      divisions: [],
      earlybirdDiscountSnapshots: [],
      combinationDiscountSnapshots: [],
    });
  }

  createEarlybirdDiscountSnapshot(
    earlybirdDiscountSnapshotCreateDto: IEarlybirdDiscountSnapshotCreateDto,
  ): EarlybirdDiscountSnapshotModel {
    return new EarlybirdDiscountSnapshotModel({
      id: ulid(),
      earlybirdStartDate: earlybirdDiscountSnapshotCreateDto.earlybirdStartDate,
      earlybirdEndDate: earlybirdDiscountSnapshotCreateDto.earlybirdEndDate,
      discountAmount: earlybirdDiscountSnapshotCreateDto.discountAmount,
      competitionId: earlybirdDiscountSnapshotCreateDto.competitionId,
      createdAt: new Date(),
    });
  }

  createCombinationDiscountSnapshot(
    combinationDiscountSnapshotCreateDto: ICombinationDiscountSnapshotCreateDto,
  ): CombinationDiscountSnapshotModel {
    return new CombinationDiscountSnapshotModel({
      id: ulid(),
      combinationDiscountRules: combinationDiscountSnapshotCreateDto.combinationDiscountRules,
      competitionId: combinationDiscountSnapshotCreateDto.competitionId,
      createdAt: new Date(),
    });
  }
}
