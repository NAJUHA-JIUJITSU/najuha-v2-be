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
  UpdateReadyApplicationReqBody,
  UpdateReadyApplicationRes,
} from './dtos';
import { Type } from 'class-transformer';

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
  ): Promise<ResponseForm<any>> {
    const application = await this.ApplicationAppService.updateDoneApplication({
      userId: req['userId'],
      applicationId,
      ...body,
    });
    return createResponseForm({ application });
  }

  /**
   * u-6-5 delete application.
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
