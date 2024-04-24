import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { ApplicationsAppService } from '../application/applications.app.service';
import { IApplication } from '../domain/interface/application.interface';
import {
  CreateApplicationReqBody,
  CreateApplicationRes,
  GetApplicationRes,
  GetExpectedPaymentRes,
  UpdateDoneApplicationReqBody,
  UpdateDoneApplicationRes,
  UpdateReadyApplicationReqBody,
  UpdateReadyApplicationRes,
} from './dtos';

@Controller('user/applications')
export class UserApplicationsController {
  constructor(private readonly ApplicationAppService: ApplicationsAppService) {}

  /**
   * u-6-1 create application.
   * - RoleLevel: USER.
   *
   * @tag u-6 applications
   * @returns application
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/')
  async createCompetitionApplication(
    @Req() req: Request,
    @TypedBody() body: CreateApplicationReqBody,
  ): Promise<ResponseForm<CreateApplicationRes>> {
    return createResponseForm(await this.ApplicationAppService.createApplication({ userId: req['userId'], ...body }));
  }

  /**
   * u-6-2 get application.
   * - RoleLevel: USER.
   *
   * @tag u-6 applications
   * @returns application
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/:applicationId')
  async getCompetitionApplication(
    @TypedParam('applicationId') applicationId: IApplication['id'],
    @Req() req: Request,
  ): Promise<ResponseForm<GetApplicationRes>> {
    return createResponseForm(
      await this.ApplicationAppService.getApplication({ userId: req['userId'], applicationId }),
    );
  }

  /**
   * u-6-3 update ready status application.
   * - RoleLevel: USER.
   * - READY(결제전) application 을 업데이트 합니다.
   * - CANCELED, DONE 상태의 application은 이 api 를 통해 업데이트 할 수 없습니다.
   * - 기존 application을 DELETED 상태로 변경하고 새로운 application 을 생성합니다. (이유, 기존 applicaiton이 실제로는 결제 됐지만 서버 오류로 실패처리 된 경우, 기존 결제 정보가 남아있어야하기 때문).
   *
   * @tag u-6 applications
   * @returns application
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/:applicationId/ready')
  async updateCompetitionApplication(
    @Req() req: Request,
    @TypedParam('applicationId') applicationId: IApplication['id'],
    @TypedBody() body: UpdateReadyApplicationReqBody,
  ): Promise<ResponseForm<UpdateReadyApplicationRes>> {
    return createResponseForm(
      await this.ApplicationAppService.updateReadyApplication({
        userId: req['userId'],
        applicationId,
        ...body,
      }),
    );
  }

  /**
   * u-6-4 update done status application.
   * - RoleLevel: USER.
   * - DONE(결제완료) application 을 업데이트 합니다.
   * - CANCELED, READY 상태의 application 은 이 api 를 통해 업데이트 할 수 없습니다.
   * - playerSnapshotUpdateDto, participationDivisionInfoUpdateDtos 중 하나는 필수로 전달해야 합니다.
   * - playerSnapshotUpdateDto 를 전달하면 playerSnapshot을 새로 생성합니다.
   * - participationDivisionInfoUpdateDtos 를 전달하면 participationDivisionInfoSnapshots을 새로 생성합니다.
   * - playerSnapshotUpdateDto, participationDivisionInfoUpdateDtos 둘 다 전달하면 둘 다 새로 생성합니다.
   *
   * @tag u-6 applications
   * @returns application
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/:applicationId/done')
  async updateDoneCompetitionApplication(
    @Req() req: Request,
    @TypedParam('applicationId') applicationId: IApplication['id'],
    @TypedBody() body: UpdateDoneApplicationReqBody,
  ): Promise<ResponseForm<UpdateDoneApplicationRes>> {
    return createResponseForm(
      await this.ApplicationAppService.updateDoneApplication({
        userId: req['userId'],
        applicationId,
        ...body,
      }),
    );
  }

  /**
   * u-6-5 delete application (아직구현 안됨).
   * - RoleLevel: USER.
   *
   * @tag u-6 applications
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/:applicationId')
  async deleteCompetitionApplication(
    @TypedParam('applicationId') applicationId: IApplication['id'],
  ): Promise<ResponseForm<void>> {
    return createResponseForm();
  }
  /**
   * u-6-6 get expected payment.
   * - RoleLevel: USER.
   *
   * @tag u-6 applications
   * @returns expected payment
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/:applicationId/expected-payment')
  async getExpectedPayment(
    @TypedParam('applicationId') applicationId: IApplication['id'],
    @Req() req: Request,
  ): Promise<ResponseForm<GetExpectedPaymentRes>> {
    return createResponseForm(
      await this.ApplicationAppService.getExpectedPayment({ userId: req['userId'], applicationId }),
    );
  }
}
