import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RoleLevels, RoleLevel } from '../../../infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from '../../../common/response/response';
import {
  CreateImageReqBody,
  CreateImageRes,
  CreateUserProfileImagePresignedPostReqBody,
  CreateUserProfileImagePresignedPostRes,
} from './images.controller.dto';
import { ImageAppService } from '../application/image.app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user/images')
export class UserImagesController {
  constructor(private readonly imageAppService: ImageAppService) {}

  /**
   * u-9-1 createImage.
   * - RoleLevel: USER.
   * - imageEntity를 생성하고, presignedPost를 반환합니다.
   * - presignedPost는 이미지를 업로드할 때 사용됩니다.
   * - presignedPost는 5분 후 만료되도록 설정되어 있습니다.
   * - presignedPost는 5MB 이하의 이미지만 업로드할 수 있도록 설정되어 있습니다.
   * - imageEntity는 10분 후에도 이미지 소유 Entity에게 FK로 연결되지 않으면 주기적으로 삭제될수 있습니다.
   *
   * @tag u-9 images
   * @security bearer
   * @param body CreateImageReqBody
   * @returns CreateImageRes
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('')
  async createImage(@Req() req: Request, @TypedBody() body: CreateImageReqBody): Promise<ResponseForm<CreateImageRes>> {
    return createResponseForm(
      await this.imageAppService.createImage({
        imageCreateDto: {
          userId: req['userId'],
          ...body,
        },
      }),
    );
  }

  /**
   * u-9-2 createUserProfileImagePresignedPost.
   * - RoleLevel: USER.
   * - userId에 해당하는 user의 profile image를 업로드할 때 사용할 presignedPost를 반환합니다.
   * - presignedPost는 이미지를 업로드할 때 사용됩니다.
   * - presignedPost는 5분 후 만료되도록 설정되어 있습니다.
   * - presignedPost는 5MB 이하의 이미지만 업로드할 수 있도록 설정되어 있습니다.
   *
   * Q. 왜 userProfileImage는 ImageEntity를 반환하지 않나요?
   * - A. userProfileImage는 userId 를 key로 bucket에 저장됩니다. 따라서 이미지를 식별하기위한 ImageEntity가 필요하지 않습니다.
   *
   * Q. 왜 userProfileImage는 userId를 key로 bucket에 저장하나요?
   * - A. 게시글이나 댓글을 볼 때, 작성자의 프로필 이미지를 함께 보여주어야 합니다. 게시글과 댓글에는 이미 작성자의 userId가 포함되어 있습니다. 그래서 userId를 키로 사용해 프로필 이미지를 버킷에 저장하면, 게시글이나 댓글을 조회할 때 userId를 이용해 쉽게 해당 작성자의 프로필 이미지를 찾을 수 있습니다.
   *
   * @tag u-9 images
   * @security bearer
   * @returns CreateImageRes
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Post('user-profile')
  async createUserProfileImagePresignedPost(
    @Req() req: Request,
    @TypedBody() body: CreateUserProfileImagePresignedPostReqBody,
  ): Promise<ResponseForm<CreateUserProfileImagePresignedPostRes>> {
    return createResponseForm(
      await this.imageAppService.createUserProfileImagePresignedPost({
        userId: req['userId'],
        format: body.format,
      }),
    );
  }

  /**
   * u-9-3 deleteUserProfileImage.
   * - RoleLevel: USER.
   * - userId를 key로 사용해 버킷에서 해당 이미지를 삭제합니다.
   *
   * Q. 왜 user domain에서 이미지를 삭제하지 않고 image domain에서 삭제하나요?
   * - A. bucket에 저장된 이미지를 직접 삭제하는 것은 image domain의 역할이라고 판단했습니다.
   *
   * @tag u-9 images
   * @security bearer
   * @returns void
   */
  @RoleLevels(RoleLevel.USER)
  @TypedRoute.Delete('user-profile')
  async deleteUserProfileImage(@Req() req: Request): Promise<ResponseForm<void>> {
    return createResponseForm(
      await this.imageAppService.deleteUserProfileImage({
        userId: req['userId'],
      }),
    );
  }

  /**
   * todo!: remove this api.
   * stream upload test api.
   *
   * @ignore
   */
  @TypedRoute.Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    return {
      url: file.location,
      key: file.key,
    };
  }
}
