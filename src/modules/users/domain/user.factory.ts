import { uuidv7 } from 'uuidv7';
import { ITemporaryUser, ITemporaryUserCreateDto } from './interface/user.interface';

export class UserFactory {
  creatTemporaryUser(dto: ITemporaryUserCreateDto): ITemporaryUser {
    return {
      id: uuidv7(),
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
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
