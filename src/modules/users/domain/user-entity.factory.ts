import { ulid } from 'ulid';
import { ITemporaryUser, ITemporaryUserCreateDto } from './interface/user.interface';

export class UserEntityFactory {
  creatTemporaryUser(dto: ITemporaryUserCreateDto): ITemporaryUser {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
