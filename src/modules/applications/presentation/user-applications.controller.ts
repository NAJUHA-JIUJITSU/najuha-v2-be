import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { ApplicationsAppService } from '../application/applications.app.service';
import { IApplication } from '../domain/interface/application.interface';
import {
  CreateApplicationReqBody,
  CreateApplicationRes,
  FindApplicationsQuery,
  FindApplicationsRes,
  GetApplicationRes,
  GetExpectedPaymentRes,
  UpdateDoneApplicationReqBody,
  UpdateDoneApplicationRes,
  UpdateReadyApplicationReqBody,
  UpdateReadyApplicationRes,
} from './dtos';

@Controller('user/applications')
export class UserApplicationsController {
  constructor(private readonly applicationAppService: ApplicationsAppService) {}

  /**
   * u-6-1 createApplication.
   * - RoleLevel: USER.
   *
   * @tag u-6 applications
   * @returns application
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/')
  async createApplication(
    @Req() req: Request,
    @TypedBody() body: CreateApplicationReqBody,
  ): Promise<ResponseForm<CreateApplicationRes>> {
    return createResponseForm(await this.applicationAppService.createApplication({ userId: req['userId'], ...body }));
  }

  /**
   * u-6-2 getApplication.
   * - RoleLevel: USER.
   *
   * @tag u-6 applications
   * @returns application
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/:applicationId')
  async getApplication(
    @TypedParam('applicationId') applicationId: IApplication['id'],
    @Req() req: Request,
  ): Promise<ResponseForm<GetApplicationRes>> {
    return createResponseForm(
      await this.applicationAppService.getApplication({ userId: req['userId'], applicationId }),
    );
  }

  /**
   * u-6-3 updateReadyApplication.
   * - RoleLevel: USER.
   * - READY(결제전) application 을 업데이트 합니다.
   * - 기존 application을 DELETED 상태로 변경하고 새로운 application 을 생성합니다. (이유, 기존 applicaiton이 실제로는 결제 됐지만 서버 오류로 실패처리 된 경우, 기존 결제 정보가 남아있어야하기 때문).
   *
   * @tag u-6 applications
   * @returns application
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/:applicationId/ready')
  async updateReadyApplication(
    @Req() req: Request,
    @TypedParam('applicationId') applicationId: IApplication['id'],
    @TypedBody() body: UpdateReadyApplicationReqBody,
  ): Promise<ResponseForm<UpdateReadyApplicationRes>> {
    return createResponseForm(
      await this.applicationAppService.updateReadyApplication({
        userId: req['userId'],
        applicationId,
        ...body,
      }),
    );
  }

  /**
   * u-6-4 updateDoneApplication.
   * - RoleLevel: USER.
   * - DONE(결제완료) application 을 업데이트 합니다.
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
  async updateDoneApplication(
    @Req() req: Request,
    @TypedParam('applicationId') applicationId: IApplication['id'],
    @TypedBody() body: UpdateDoneApplicationReqBody,
  ): Promise<ResponseForm<UpdateDoneApplicationRes>> {
    return createResponseForm(
      await this.applicationAppService.updateDoneApplication({
        userId: req['userId'],
        applicationId,
        ...body,
      }),
    );
  }

  /**
   * u-6-5 deleteApplication (아직구현 안됨).
   * - RoleLevel: USER.
   *
   * @tag u-6 applications
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('/:applicationId')
  async deleteApplication(@TypedParam('applicationId') applicationId: IApplication['id']): Promise<ResponseForm<void>> {
    return createResponseForm(void 0);
  }

  /**
   * u-6-6 getExpectedPayment.
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
      await this.applicationAppService.getExpectedPayment({ userId: req['userId'], applicationId }),
    );
  }

  /**
   * u-6-7 findApplications.
   * - RoleLevel: USER.
   *
   * @tag u-6 applications
   * @returns applications
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/')
  async findApplications(
    @Req() req: Request,
    @TypedQuery() query: FindApplicationsQuery,
  ): Promise<ResponseForm<FindApplicationsRes>> {
    return createResponseForm(
      await this.applicationAppService.findApplications({
        page: query.page ?? 0,
        limit: query.limit ?? 10,
        userId: req['userId'],
      }),
    );
  }
}
