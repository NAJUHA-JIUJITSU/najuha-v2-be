import { ITemporaryUser, ITemporaryUserCreateDto, IUser, IUserUpdateDto } from '../domain/interface/user.interface';

// ---------------------------------------------------------------------------
// usersAppService Param
// ---------------------------------------------------------------------------
export interface CreateUserParam {
  userCreateDto: ITemporaryUserCreateDto;
}

export interface UpdateUserParam {
  userUpdateDto: IUserUpdateDto;
}

export interface GetMeParam {
  userId: IUser['id'];
}

// ---------------------------------------------------------------------------
// usersAppService Result
// ---------------------------------------------------------------------------
export interface CreateUserRet {
  user: ITemporaryUser;
}

export interface UpdateUserRet {
  user: IUser;
}

export interface GetMeRet {
  user: IUser;
}
