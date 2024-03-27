import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { CreateApplicationReqDto } from '../../applications/structure/dto/request/create-application.req.dto';
import { UpdateApplicationReqDto } from '../../applications/structure/dto/request/update-application.req.dto';
import { Application } from '../domain/entities/application.entity';
import { ApplicationsAppService } from '../application/applications.app.service';
import { CreateApplicationResDto } from '../structure/dto/response/create-application.res.dto';

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
    @TypedBody() dto: CreateApplicationReqDto,
  ): Promise<ResponseForm<CreateApplicationResDto>> {
    const application = await this.ApplicationAppService.createApplication(req['userId'], dto);
    return createResponseForm({ application });
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
    @TypedParam('applicationId') applicationId: Application['id'],
  ): Promise<ResponseForm<any>> {
    return createResponseForm({});
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
    @TypedParam('applicationId') applicationId: Application['id'],
    @TypedBody() dto: UpdateApplicationReqDto,
  ): Promise<ResponseForm<any>> {
    return createResponseForm({});
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
    @TypedParam('applicationId') applicationId: Application['id'],
  ): Promise<ResponseForm<void>> {
    return createResponseForm();
  }
}
