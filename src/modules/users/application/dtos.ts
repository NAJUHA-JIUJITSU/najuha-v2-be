import { ITemporaryUser, ITemporaryUserCreateDto, IUser, IUserUpdateDto } from '../domain/interface/user.interface';

// Application Layer Param DTOs ----------------------------------------------
export interface CreateUserParam {
  userCreateDto: ITemporaryUserCreateDto;
}

export interface UpdateUserParam {
  userUpdateDto: IUserUpdateDto;
}

export interface GetMeParam {
  userId: IUser['id'];
}

// Application Layer Result DTOs ----------------------------------------------
export interface CreateUserRet {
  user: ITemporaryUser;
}

export interface UpdateUserRet {
  user: IUser;
}

export interface GetMeRet {
  user: IUser;
}
