import { CreateUserRet, GetMeRet, UpdateUserRet } from '../application/users.app.dtos';
import { ITemporaryUserCreateDto, IUserUpdateDto } from '../domain/interface/user.interface';

// ---------------------------------------------------------------------------
// usersController Request
// ---------------------------------------------------------------------------
export interface CreateUserReqBody extends ITemporaryUserCreateDto {}

export interface UpdateUserReqBody extends Omit<IUserUpdateDto, 'id'> {}

// ---------------------------------------------------------------------------
// usersController Response
// ---------------------------------------------------------------------------
export interface CreateUserRes extends CreateUserRet {}

export interface UpdateUserRes extends UpdateUserRet {}

export interface GetMeRes extends GetMeRet {}
