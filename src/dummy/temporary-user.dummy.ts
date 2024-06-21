import { uuidv7 } from 'uuidv7';
import { ITemporaryUser } from '../modules/users/domain/interface/temporary-user.interface';
import { assert } from 'typia';

export class TemporaryUserDummyBuilder {
  private user: Partial<ITemporaryUser> = {};

  constructor() {
    this.user.id = uuidv7();
    this.user.role = 'TEMPORARY_USER';
    this.user.snsAuthProvider = 'KAKAO';
    this.user.snsId = uuidv7();
    this.user.name = 'dummyTemporaryUser';
    this.user.email = 'dummyTemporaryUser@gmail.com';
    this.user.phoneNumber = null;
    this.user.nickname = null;
    this.user.gender = null;
    this.user.birth = null;
    this.user.belt = null;
    this.user.status = 'ACTIVE';
    this.user.createdAt = new Date();
    this.user.updatedAt = new Date();
  }

  public setId(id: string): this {
    this.user.id = id;
    return this;
  }

  public setRole(role: ITemporaryUser['role']): this {
    this.user.role = role;
    return this;
  }

  public setSnsAuthProvider(provider: ITemporaryUser['snsAuthProvider']): this {
    this.user.snsAuthProvider = provider;
    return this;
  }

  public setSnsId(snsId: string): this {
    this.user.snsId = snsId;
    return this;
  }

  public setName(name: string): this {
    this.user.name = name;
    return this;
  }

  public setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  public setPhoneNumber(phoneNumber: string | null): this {
    this.user.phoneNumber = phoneNumber;
    return this;
  }

  public setNickname(nickname: string | null): this {
    this.user.nickname = nickname;
    return this;
  }

  public setGender(gender: ITemporaryUser['gender'] | null): this {
    this.user.gender = gender;
    return this;
  }

  public setBirth(birth: string | null): this {
    this.user.birth = birth;
    return this;
  }

  public setBelt(belt: ITemporaryUser['belt'] | null): this {
    this.user.belt = belt;
    return this;
  }

  public setStatus(status: ITemporaryUser['status']): this {
    this.user.status = status;
    return this;
  }

  public setCreatedAt(date: Date): this {
    this.user.createdAt = date;
    return this;
  }

  public setUpdatedAt(date: Date): this {
    this.user.updatedAt = date;
    return this;
  }

  public build(): ITemporaryUser {
    return assert<ITemporaryUser>(this.user);
  }
}
