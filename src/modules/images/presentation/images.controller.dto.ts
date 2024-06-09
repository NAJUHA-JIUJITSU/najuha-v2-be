import { CreateImageRet } from '../application/image.app.dto';
import { IImageCreateDto } from '../domain/interface/image.interface';

// ---------------------------------------------------------------------------
// imageController Request
// ---------------------------------------------------------------------------
export interface CreateImageReqBody extends Pick<IImageCreateDto, 'format' | 'path'> {}

// ---------------------------------------------------------------------------
// imageController Response
// ---------------------------------------------------------------------------
export interface CreateImageRes extends CreateImageRet {}
