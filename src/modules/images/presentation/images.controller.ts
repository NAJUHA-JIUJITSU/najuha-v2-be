import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Req } from '@nestjs/common';
import { RoleLevels, RoleLevel } from '../../../infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from '../../../common/response/response';
import { CreateImageReqBody, CreateImageRes } from './images.controller.dto';
import { ImageAppService } from '../application/image.app.service';

@Controller('user/images')
export class ImagesController {
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
}
