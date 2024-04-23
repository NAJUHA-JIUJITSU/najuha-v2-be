import { CreateUserParam, CreateUserRet, GetMeRet, UpdateUserParam, UpdateUserRet } from '../application/dtos';
import { IUser } from '../domain/interface/user.interface';

// Presentation Layer Request DTOs
export type CreateUserReqBody = IUser.Dto.Create;

export type UpdateUserReqBody = Omit<IUser.Dto.Update, 'id'>;

// Presentation Layer Response DTOs
export interface CreateUserRes extends CreateUserRet {}

export interface UpdateUserRes extends UpdateUserRet {}

export interface GetMeRes extends GetMeRet {}
