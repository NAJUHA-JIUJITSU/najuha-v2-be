import { CreateUserProfileImageRet, CreateUserRet, GetMeRet, UpdateUserRet } from '../application/users.app.dtos';
import { ITemporaryUserCreateDto } from '../domain/interface/temporary-user.interface';
import { IUserProfileImageCreateDto } from '../domain/interface/user-profile-image.interface';
import { IUserUpdateDto } from '../domain/interface/user.interface';

// ---------------------------------------------------------------------------
// usersController Request
// ---------------------------------------------------------------------------
export interface CreateUserReqBody extends ITemporaryUserCreateDto {}

export interface UpdateUserReqBody extends Omit<IUserUpdateDto, 'id'> {}

export interface CreateUserProfileImageReqBody extends Pick<IUserProfileImageCreateDto, 'imageId'> {}

// ---------------------------------------------------------------------------
// usersController Response
// ---------------------------------------------------------------------------
export interface CreateUserRes extends CreateUserRet {}

export interface UpdateUserRes extends UpdateUserRet {}

export interface GetMeRes extends GetMeRet {}

export interface CreateUserProfileImageRes extends CreateUserProfileImageRet {}
