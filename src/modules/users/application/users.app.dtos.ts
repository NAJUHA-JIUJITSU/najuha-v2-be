import { ITemporaryUser, ITemporaryUserCreateDto } from '../domain/interface/temporary-user.interface';
import { IUserProfileImageCreateDto } from '../domain/interface/user-profile-image.interface';
import { IUser, IUserDetail, IUserUpdateDto } from '../domain/interface/user.interface';

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

export interface DeleteProfileImageParam {
  userId: IUser['id'];
}

// ---------------------------------------------------------------------------
// usersAppService Result
// ---------------------------------------------------------------------------
export interface CreateUserRet {
  user: ITemporaryUser;
}

export interface UpdateUserRet {
  user: IUserDetail;
}

export interface GetMeRet {
  user: IUserDetail;
}

export interface CreateUserProfileImageRet {
  user: IUserDetail;
}
