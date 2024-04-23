import { IUser } from '../domain/interface/user.interface';

// Application Layer Param DTOs
export interface CreateUserParam {
  userCreateDto: IUser.Dto.Create;
}

export interface UpdateUserParam {
  userUpdateDto: IUser.Dto.Update;
}

export interface GetMeParam {
  userId: IUser['id'];
}

// Application Layer Result DTOs
export interface CreateUserRet {
  user: IUser.Entity.TemporaryUser;
}

export interface UpdateUserRet {
  user: IUser.Entity.TemporaryUser | IUser.Entity.User;
}

export interface GetMeRet {
  user: IUser.Entity.TemporaryUser | IUser.Entity.User;
}
