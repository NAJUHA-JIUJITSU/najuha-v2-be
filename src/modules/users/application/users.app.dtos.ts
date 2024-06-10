import { IUserProfileImageCreateDto } from '../domain/interface/user-profile-image.interface';
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

export interface CreateUserProfileImageParam {
  userProfileImageCreateDto: IUserProfileImageCreateDto;
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

export interface CreateUserProfileImageRet {
  user: IUser;
}
