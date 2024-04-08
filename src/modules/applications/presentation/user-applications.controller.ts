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
  UpdateApplicationReqBody,
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
   * u-6-3 update application.
   * - RoleLevel: USER.
   *
   * @tag u-6 applications
   * @returns application
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/:applicationId')
  async updateCompetitionApplication(
    @Req() req: Request,
    @TypedParam('applicationId') applicationId: IApplication['id'],
    @TypedBody() body: UpdateApplicationReqBody,
  ): Promise<ResponseForm<any>> {
    const application = await this.ApplicationAppService.updateApplication({
      userId: req['userId'],
      applicationId,
      ...body,
    });
    return createResponseForm({ application });
  }

  /**
   * u-6-4 delete application.
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
   * u-6-5 get expected payment.
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
