import { TypedBody, TypedException, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from 'src/infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from 'src/common/response/response';
import { UsersAppService } from 'src/modules/users/application/users.app.service';
import { ENTITY_NOT_FOUND } from 'src/common/response/errorResponse';
import {
  CreateUserProfileImageReqBody,
  CreateUserProfileImageRes,
  CreateUserReqBody,
  CreateUserRes,
  GetMeRes,
  UpdateUserReqBody,
  UpdateUserRes,
} from './users.controller.dto';

@Controller('user/users')
export class UserUsersController {
  constructor(private readonly UsersAppService: UsersAppService) {}

  /**
   * u-3-1 createUser. // todo!: api 삭제 예정(유저 생성은 내부적으로만 사용)).
   * - RoleLevel: USER.
   *
   * @tag u-3 users
   * @security bearer
   * @param body CreateUserReqBody
   * @returns CreateUserRes
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/')
  async createUser(@TypedBody() body: CreateUserReqBody): Promise<ResponseForm<CreateUserRes>> {
    return createResponseForm(await this.UsersAppService.createUser({ userCreateDto: body }));
  }

  /**
   * u-3-2 updateUser.
   * - RoleLevel: USER.
   *
   * @tag u-3 users
   * @security bearer
   * @param body UpdateUserReqBody
   * @returns UpdateUserRes
   */
  @TypedException<ENTITY_NOT_FOUND>(404, 'ENTITY_NOT_FOUND')
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Patch('/')
  async updateUser(@Req() req: Request, @TypedBody() body: UpdateUserReqBody): Promise<ResponseForm<UpdateUserRes>> {
    return createResponseForm(await this.UsersAppService.updateUser({ userUpdateDto: { ...body, id: req['userId'] } }));
  }

  /**
   * u-3-3 getMe.
   * - RoleLevel: USER.
   *
   * @tag u-3 users
   * @security bearer
   * @returns GetMeRes
   */
  @TypedException<ENTITY_NOT_FOUND>(404, 'ENTITY_NOT_FOUND')
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Get('/me')
  async getMe(@Req() req: Request): Promise<ResponseForm<GetMeRes>> {
    return createResponseForm(await this.UsersAppService.getMe({ userId: req['userId'] }));
  }

  /**
   * u-3-4 createUserProfileImage.
   * - RoleLevel: USER.
   * - 유저의 프로필 이미지를 생성합니다.
   * - 업데이트 시에도 이 API를 사용합니다.
   * - 기존에 프로필 이미지가 있을 경우, 기존 이미지는 soft delete 처리되고 새로운 이미지가 생성됩니다.
   *
   * @tag u-3 users
   * @security bearer
   * @param body CreateUserProfileImageReqBody
   * @returns CreateUserProfileImageRes
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('/profile-image')
  async createUserProfileImage(
    @Req() req: Request,
    @TypedBody() body: CreateUserProfileImageReqBody,
  ): Promise<ResponseForm<CreateUserProfileImageRes>> {
    return createResponseForm(
      await this.UsersAppService.createUserProfileImage({
        userProfileImageSnapshotCreateDto: {
          userId: req['userId'],
          imageId: body.imageId,
        },
      }),
    );
  }
}
