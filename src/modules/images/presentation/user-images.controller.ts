import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RoleLevels, RoleLevel } from '../../../infrastructure/guard/role.guard';
import { ResponseForm, createResponseForm } from '../../../common/response/response';
import { CreateImageReqBody, CreateImageRes } from './images.controller.dto';
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
   * Q. 이미지 소유 Entity에게 FK로 연결된다는게 무슨 의미인가요?
   * A. 이미지를 bucket에 업로드 이후 imageId 를 u-3-4 createUserProfileImage API를 통해 업로드한 유저에게 FK로 연결합니다.
   *
   * Q. 해당 이미지에 어떻게 접근하나요?
   * A. `${bucketHost}/${bucketName}/${imageEntity.path}/${imageEntity.id}` 형태로 접근할 수 있습니다.
   * ex) http://localhost:9000/najuha-v2-bucket/competition/01902a06-4db4-71ea-b9a8-2a8a8f489667
   *
   * Q. path는 어떻게 결정되나요?
   * A. u-9-1 createImage 요청시 보내는 body의 path에 따라 결정됩니다. 설정 가능한 path: ['competition', 'user-profile', 'post']
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
