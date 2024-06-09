import { TPresignedPost } from 'src/infrastructure/bucket/bucket.interface';
import { IImage, IImageCreateDto } from '../domain/interface/image.interface';

// ---------------------------------------------------------------------------
// imageAppService Param
// ---------------------------------------------------------------------------
export interface CreateImageParam {
  imageCreateDto: IImageCreateDto;
}

// ---------------------------------------------------------------------------
// imageAppService Result
// ---------------------------------------------------------------------------
export interface CreateImageRet {
  image: IImage;
  presignedPost: TPresignedPost;
}
