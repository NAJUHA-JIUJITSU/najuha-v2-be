import { IApplication, IApplicationCreateDto, IApplicationModelData } from './interface/application.interface';
import { IDivisionModelData } from '../../competitions/domain/interface/division.interface';
import { uuidv7 } from 'uuidv7';
import {
  IParticipationDivisionInfo,
  IParticipationDivisionInfoModelData,
  IParticipationDivisionInfoUpdateDto,
} from './interface/participation-division-info.interface';
import { IPlayerSnapshotCreateDto, IPlayerSnapshotModelData } from './interface/player-snapshot.interface';
import { IParticipationDivisionInfoSnapshotModelData } from './interface/participation-division-info-snapshot.interface';
import { IAdditionalInfoCreateDto, IAdditionalInfoModelData } from './interface/additional-info.interface';
import { CompetitionModel } from '../../competitions/domain/model/competition.model';
import { IApplicationOrderModelData } from './interface/application-order.interface';
import { ApplicationModel } from './model/application.model';
import { UserModel } from '../../users/domain/model/user.model';
import { IApplicationOrderPaymentSnapshotModelData } from './interface/application-order-payment-sanpshot.interface';
import { CalculatePaymentService } from '../../competitions/domain/calculate-payment.domain.service';

export class ApplicationFactory {
  static createReadyApplication(
    competition: CompetitionModel,
    {
      userId,
      competitionId,
      applicationType,
      participationDivisionIds,
      playerSnapshotCreateDto,
      additionalInfoCreateDtos,
    }: IApplicationCreateDto,
  ): IApplicationModelData {
    const applicationId = uuidv7();
    const playerSnapshot = this.createPlayerSnapshot(applicationId, playerSnapshotCreateDto);
    const participationDivisionInfos = this.createParticipationDivisionInfos(
      applicationId,
      competition,
      participationDivisionIds,
    );
    const additionaInfos = this.createAdditionalInfos(applicationId, additionalInfoCreateDtos ?? []);
    return {
      id: applicationId,
      type: applicationType,
      userId,
      competitionId,
      status: 'READY',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      playerSnapshots: [playerSnapshot],
      participationDivisionInfos,
      additionaInfos,
      applicationOrders: [],
    };
  }

  static createPlayerSnapshot(
    applicationId: IApplication['id'],
    playerSnapshotCreateDto: IPlayerSnapshotCreateDto,
  ): IPlayerSnapshotModelData {
    return {
      id: uuidv7(),
      applicationId,
      name: playerSnapshotCreateDto.name,
      gender: playerSnapshotCreateDto.gender,
      birth: playerSnapshotCreateDto.birth,
      phoneNumber: playerSnapshotCreateDto.phoneNumber,
      belt: playerSnapshotCreateDto.belt,
      network: playerSnapshotCreateDto.network,
      team: playerSnapshotCreateDto.team,
      masterName: playerSnapshotCreateDto.masterName,
      createdAt: new Date(),
    };
  }

  static createParticipationDivisionInfos(
    applicationId: IApplication['id'],
    competition: CompetitionModel,
    participationDivisionIds: IParticipationDivisionInfo['id'][],
  ): IParticipationDivisionInfoModelData[] {
    const divisions = competition.getManyDivisions(participationDivisionIds);
    return divisions.map((division) => {
      const participationDivisionInfoId = uuidv7();
      const participationDivisionInfosSnapshot = this.createParticipationDivisionInfoSnapshot(
        participationDivisionInfoId,
        division.toData(),
      );
      return {
        id: participationDivisionInfoId,
        status: 'READY',
        createdAt: new Date(),
        applicationId,
        participationDivisionInfoSnapshots: [participationDivisionInfosSnapshot],
        payedDivisionId: null,
        payedPriceSnapshotId: null,
        payedDivision: null,
        payedPriceSnapshot: null,
      };
    });
  }

  static createParticipationDivisionInfoSnapshot(
    participationDivisionInfoId: IParticipationDivisionInfo['id'],
    division: IDivisionModelData,
  ): IParticipationDivisionInfoSnapshotModelData {
    return {
      id: uuidv7(),
      divisionId: division.id,
      division,
      participationDivisionInfoId,
      createdAt: new Date(),
    };
  }

  static createManyParticipationDivisionInfoSnapshots(
    competition: CompetitionModel,
    participationDivisionInfoUpdateDtos: IParticipationDivisionInfoUpdateDto[],
  ): IParticipationDivisionInfoSnapshotModelData[] {
    return participationDivisionInfoUpdateDtos.map((updateParticipationDivisionInfoDto) => {
      const division = competition.getDivision(updateParticipationDivisionInfoDto.newParticipationDivisionId);
      return this.createParticipationDivisionInfoSnapshot(
        updateParticipationDivisionInfoDto.participationDivisionInfoId,
        division.toData(),
      );
    });
  }

  static createAdditionalInfos(
    applicationId: IApplication['id'],
    additionalInfoCreateDtos: IAdditionalInfoCreateDto[],
  ): IAdditionalInfoModelData[] {
    return additionalInfoCreateDtos.map((additionalInfoCreateDto) => {
      return {
        id: uuidv7(),
        applicationId,
        type: additionalInfoCreateDto.type,
        value: additionalInfoCreateDto.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  }

  static createApplicationOrder(
    application: ApplicationModel,
    user: UserModel,
    competition: CompetitionModel,
  ): IApplicationOrderModelData {
    const applicationOrderId = uuidv7();

    const earlybirdDiscountSnapshot = competition.latestEarlybirdDiscountSnapshot;
    const combinationDiscountSnapshot = competition.latestCombinationDiscountSnapshot;
    const expectedPayment = application.expectedPayment;

    const applicationOrderPaymentSnapshotId = uuidv7();
    const participationDivisionInfos = application.participationDivisionInfos;

    return {
      id: applicationOrderId,
      createdAt: new Date(),
      orderId: `${applicationOrderId}_${competition.competitionPaymentId}`,
      paymentKey: null,
      orderName: competition.title.slice(0, 100),
      customerName: user.name,
      customerEmail: user.email.slice(0, 100),
      status: 'READY',
      isPayed: false,
      applicationId: application.id,
      earlybirdDiscountSnapshotId: earlybirdDiscountSnapshot ? earlybirdDiscountSnapshot.id : null,
      combinationDiscountSnapshotId: combinationDiscountSnapshot ? combinationDiscountSnapshot.id : null,
      earlybirdDiscountSnapshot: earlybirdDiscountSnapshot ? earlybirdDiscountSnapshot.toData() : null,
      combinationDiscountSnapshot: combinationDiscountSnapshot ? combinationDiscountSnapshot.toData() : null,
      applicationOrderPaymentSnapshots: [
        {
          id: applicationOrderPaymentSnapshotId,
          createdAt: new Date(),
          normalAmount: expectedPayment.normalAmount,
          earlybirdDiscountAmount: expectedPayment.earlybirdDiscountAmount,
          combinationDiscountAmount: expectedPayment.combinationDiscountAmount,
          totalAmount: expectedPayment.totalAmount,
          applicationOrderId: applicationOrderId,
          participationDivisionInfoPayments: participationDivisionInfos.map((participationDivisionInfo) => {
            return {
              id: uuidv7(),
              createdAt: new Date(),
              status: 'READY',
              applicationOrderPaymentSnapshotId,
              participationDivisionInfoId: participationDivisionInfo.id,
              divisionId: participationDivisionInfo.getLatestParticipationDivisionInfoSnapshot().division.id,
              priceSnapshotId:
                participationDivisionInfo.getLatestParticipationDivisionInfoSnapshot().division.latestPriceSnapshot.id,
              participationDivisionInfo: participationDivisionInfo.toData(),
              division: participationDivisionInfo.getLatestParticipationDivisionInfoSnapshot().division.toData(),
              priceSnapshot: participationDivisionInfo
                .getLatestParticipationDivisionInfoSnapshot()
                .division.latestPriceSnapshot.toData(),
            };
          }),
        },
      ],
    };
  }

  static createApplicationOrderPaymentSnapshot(
    application: ApplicationModel,
  ): IApplicationOrderPaymentSnapshotModelData {
    const doneStatusOrder = application.getPayedApplicationOrder();
    const earlybirdDiscountSnapshot = doneStatusOrder.earlybirdDiscountSnapshot;
    const combinationDiscountSnapshot = doneStatusOrder.combinationDiscountSnapshot;

    const divisions = doneStatusOrder.latestApplicationOrderPaymentSnapshot.participationDivisionInfoPayments
      .filter((participationDivisionInfoPayment) => {
        return participationDivisionInfoPayment.status === 'DONE';
      })
      .map((participationDivisionInfoPayment) => {
        return participationDivisionInfoPayment.division;
      });

    const priceSnapshots = doneStatusOrder.latestApplicationOrderPaymentSnapshot.participationDivisionInfoPayments
      .filter((participationDivisionInfoPayment) => {
        return participationDivisionInfoPayment.status === 'DONE';
      })
      .map((participationDivisionInfoPayment) => {
        return participationDivisionInfoPayment.priceSnapshot;
      });

    const reCalculatedPayment = CalculatePaymentService.calculate(
      divisions,
      priceSnapshots,
      earlybirdDiscountSnapshot,
      combinationDiscountSnapshot,
    );

    const doneStatusParticipationDivisionInfoPayments =
      doneStatusOrder.latestApplicationOrderPaymentSnapshot.participationDivisionInfoPayments.filter(
        (participationDivisionInfoPayment) => {
          return participationDivisionInfoPayment.status === 'DONE';
        },
      );

    const newApplicationOrderPaymentSnapshotId = uuidv7();
    return {
      id: newApplicationOrderPaymentSnapshotId,
      createdAt: new Date(),
      normalAmount: reCalculatedPayment.normalAmount,
      earlybirdDiscountAmount: reCalculatedPayment.earlybirdDiscountAmount,
      combinationDiscountAmount: reCalculatedPayment.combinationDiscountAmount,
      totalAmount: reCalculatedPayment.totalAmount,
      applicationOrderId: application.id,
      participationDivisionInfoPayments: doneStatusParticipationDivisionInfoPayments.map(
        (participationDivisionInfoPayment) => {
          return {
            id: uuidv7(),
            createdAt: new Date(),
            status: 'DONE',
            applicationOrderPaymentSnapshotId: newApplicationOrderPaymentSnapshotId,
            participationDivisionInfoId: participationDivisionInfoPayment.participationDivisionInfoId,
            divisionId: participationDivisionInfoPayment.divisionId,
            priceSnapshotId: participationDivisionInfoPayment.priceSnapshotId,
            participationDivisionInfo: participationDivisionInfoPayment.participationDivisionInfo.toData(),
            division: participationDivisionInfoPayment.division.toData(),
            priceSnapshot: participationDivisionInfoPayment.priceSnapshot.toData(),
          };
        },
      ),
    };
  }
}
