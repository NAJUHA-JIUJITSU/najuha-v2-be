import { TId } from '../../../common/common-types';
import { TPresignedPost } from '../../../infrastructure/bucket/bucket.interface';
import { IImage, IImageCreateDto, TImageFormat } from '../domain/interface/image.interface';

// ---------------------------------------------------------------------------
// imageAppService Param
// ---------------------------------------------------------------------------
export interface CreateImageParam {
  imageCreateDto: IImageCreateDto;
}

export interface CreateUserProfileImagePresignedPostParam {
  userId: TId;
  format: TImageFormat;
}

export interface DeleteUserProfileImageParam {
  userId: TId;
}

// ---------------------------------------------------------------------------
// imageAppService Result
// ---------------------------------------------------------------------------
export interface CreateImageRet {
  image: IImage;
  presignedPost: TPresignedPost;
}

export interface CreateUserProfileImagePresignedPostRet {
  presignedPost: TPresignedPost;
}
