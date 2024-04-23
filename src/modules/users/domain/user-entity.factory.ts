import { ulid } from 'ulid';
import { IUser } from './interface/user.interface';

export class UserEntityFactory {
  creatTemporaryUser(dto: IUser.Dto.Create): IUser.Entity.TemporaryUser {
    return {
      id: ulid(),
      role: 'TEMPORARY_USER',
      snsAuthProvider: dto.snsAuthProvider,
      snsId: dto.snsId,
      email: dto.email,
      name: dto.name,
      phoneNumber: dto.phoneNumber ?? null,
      gender: dto.gender ?? null,
      birth: dto.birth ?? null,
      nickname: null,
      belt: null,
      profileImageUrlKey: null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
