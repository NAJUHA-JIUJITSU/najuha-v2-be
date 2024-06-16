import { CreateImageRet, CreateUserProfileImagePresignedPostRet } from '../application/image.app.dto';
import { IImageCreateDto, TImageFormat } from '../domain/interface/image.interface';

// ---------------------------------------------------------------------------
// imageController Request
// ---------------------------------------------------------------------------
export interface CreateImageReqBody extends Pick<IImageCreateDto, 'format' | 'path'> {}

export interface CreateUserProfileImagePresignedPostReqBody {
  format: TImageFormat;
}

// ---------------------------------------------------------------------------
// imageController Response
// ---------------------------------------------------------------------------
export interface CreateImageRes extends CreateImageRet {}

export interface CreateUserProfileImagePresignedPostRes extends CreateUserProfileImagePresignedPostRet {}
