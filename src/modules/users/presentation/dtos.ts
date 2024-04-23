import { CreateUserParam, CreateUserRet, GetMeRet, UpdateUserParam, UpdateUserRet } from '../application/dtos';

// Presentation Layer Request DTOs ----------------------------------------------
export type CreateUserReqBody = CreateUserParam['userCreateDto'];

export type UpdateUserReqBody = Omit<UpdateUserParam['userUpdateDto'], 'id'>;

// Presentation Layer Response DTOs ----------------------------------------------
export interface CreateUserRes extends CreateUserRet {}

export interface UpdateUserRes extends UpdateUserRet {}

export interface GetMeRes extends GetMeRet {}
